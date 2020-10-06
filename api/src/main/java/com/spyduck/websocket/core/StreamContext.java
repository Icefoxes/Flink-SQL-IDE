package com.spyduck.websocket.core;

import com.spyduck.websocket.exception.ContextIsRunningException;
import com.spyduck.websocket.model.catalog.CatalogDto;
import com.spyduck.websocket.model.catalog.Column;
import com.spyduck.websocket.model.catalog.DatabaseDto;
import com.spyduck.websocket.model.catalog.Table;
import lombok.Data;
import org.apache.calcite.rel.metadata.JaninoRelMetadataProvider;
import org.apache.calcite.rel.metadata.RelMetadataQueryBase;
import org.apache.flink.streaming.api.CheckpointingMode;
import org.apache.flink.streaming.api.environment.CheckpointConfig;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.apache.flink.table.api.EnvironmentSettings;
import org.apache.flink.table.api.TableResult;
import org.apache.flink.table.api.bridge.java.StreamTableEnvironment;
import org.apache.flink.table.catalog.Catalog;
import org.apache.flink.table.catalog.CatalogBaseTable;
import org.apache.flink.table.catalog.ObjectPath;
import org.apache.flink.table.catalog.exceptions.DatabaseNotExistException;
import org.apache.flink.table.catalog.exceptions.TableNotExistException;
import org.apache.flink.table.planner.plan.metadata.FlinkDefaultRelMetadataProvider;
import org.apache.flink.types.Row;
import org.apache.flink.util.CloseableIterator;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

/**
 * host streaming context per each user
 */
@Data
public class StreamContext {
    private Long timestamp;

    private StreamTableEnvironment tableEnvironment;

    private volatile AtomicReference<Boolean> running = new AtomicReference<>();

    private StreamContext(StreamTableEnvironment streamTableEnvironment) {
        this.tableEnvironment = streamTableEnvironment;
        this.timestamp = Instant.now().toEpochMilli();
        this.running.set(false);
    }

    public Long getLastRunning() {
        return timestamp;
    }

    public Boolean getIsRunning() {
        return this.running.get();
    }

    public CloseableIterator<Row> ExecuteCommand(String command)
            throws ContextIsRunningException {
        if (!running.get()) {
            this.running.set(true);
            try {
                // magic hack
                RelMetadataQueryBase.THREAD_PROVIDERS.set(JaninoRelMetadataProvider.of(FlinkDefaultRelMetadataProvider.INSTANCE()));
                TableResult rlt = this.tableEnvironment.executeSql(command);
                return rlt.collect();
            } finally {
                this.timestamp = Instant.now().toEpochMilli();
                this.running.set(false);
            }
        }
        throw new ContextIsRunningException("Context Is Running, Please Try Later");
    }


    public List<CatalogDto> getCatalog() throws DatabaseNotExistException, TableNotExistException {
        List<CatalogDto> catalogs = new ArrayList<>();
        for (String catalogName : this.tableEnvironment.listCatalogs()) {
            CatalogDto catalogDto = new CatalogDto(catalogName);
            Catalog catalog = this.tableEnvironment.getCatalog(catalogName).orElse(null);
            if (catalog != null) {
                for (String databaseName : catalog.listDatabases()) {
                    DatabaseDto databaseDto = new DatabaseDto(databaseName);
                    catalogDto.getDatabases().add(databaseDto);

                    for (String tableName : catalog.listTables(databaseName)) {
                        Table tableDto = new Table(tableName);
                        CatalogBaseTable table = catalog.getTable(new ObjectPath(databaseName, tableName));
                        tableDto.getProperties().putAll(table.getOptions());
                        table.getSchema().getTableColumns().forEach(col -> tableDto.getColumns().add(
                                new Column(
                                        col.getName(),
                                        col.getType().getLogicalType().toString(),
                                        col.getType().getConversionClass().toGenericString())));
                        databaseDto.getTables().add(tableDto);
                    }
                }
            }
            catalogs.add(catalogDto);
        }
        return catalogs;
    }

    public static StreamContext of() {
        StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();
        env.setParallelism(1);
        env.enableCheckpointing(1000 * 60);
        // advanced options:
        // set mode to exactly-once (this is the default)
        env.getCheckpointConfig().setCheckpointingMode(CheckpointingMode.EXACTLY_ONCE);
        // make sure 500 ms of progress happen between checkpoints
        env.getCheckpointConfig().setMinPauseBetweenCheckpoints(500);
        // checkpoints have to complete within one minute, or are discarded
        env.getCheckpointConfig().setCheckpointTimeout(60000);
        // allow only one checkpoint to be in progress at the same time
        env.getCheckpointConfig().setMaxConcurrentCheckpoints(1);
        // enable externalized checkpoints which are retained after job cancellation
        env.getCheckpointConfig().enableExternalizedCheckpoints(CheckpointConfig.ExternalizedCheckpointCleanup.RETAIN_ON_CANCELLATION);
        // allow job recovery fallback to checkpoint when there is a more recent savepoint
        env.getCheckpointConfig().setPreferCheckpointForRecovery(true);
        EnvironmentSettings bsSettings = EnvironmentSettings
                .newInstance()
                .useBlinkPlanner()
                .inStreamingMode()
                .build();
        return new StreamContext(StreamTableEnvironment.create(env, bsSettings));
    }
}
