package com.spyduck.websocket.utils;

import com.spyduck.websocket.core.StringConsumer;
import org.apache.flink.table.api.TableColumn;
import org.apache.flink.table.api.TableResult;
import org.apache.flink.table.utils.EncodingUtils;
import org.apache.flink.types.Row;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Stream;

import static org.apache.flink.table.utils.PrintUtils.*;
import static org.apache.flink.table.utils.PrintUtils.NULL_COLUMN;

public class BatchTableFormatter {
    private static final String COLUMN_TRUNCATED_FLAG = "...";

    private static String truncateString(String col, int targetWidth) {
        int passedWidth = 0;
        int i = 0;
        for (; i < col.length(); i++) {
            if (isFullWidth(Character.codePointAt(col, i))) {
                passedWidth += 2;
            } else {
                passedWidth += 1;
            }
            if (passedWidth > targetWidth) {
                break;
            }
        }
        String substring = col.substring(0, i);

        // pad with ' ' before the column
        int lackedWidth = targetWidth - getStringDisplayWidth(substring);
        if (lackedWidth > 0) {
            substring = EncodingUtils.repeat(' ', lackedWidth) + substring;
        }
        return substring;
    }

    public static void printSingleRow(int[] colWidths, String[] cols, StringConsumer consumer) throws IOException {
        StringBuilder sb = new StringBuilder();
        sb.append("|");
        int idx = 0;
        for (String col : cols) {
            sb.append(" ");
            int displayWidth = getStringDisplayWidth(col);
            if (displayWidth <= colWidths[idx]) {
                sb.append(EncodingUtils.repeat(' ', colWidths[idx] - displayWidth));
                sb.append(col);
            } else {
                sb.append(truncateString(col, colWidths[idx] - COLUMN_TRUNCATED_FLAG.length()));
                sb.append(COLUMN_TRUNCATED_FLAG);
            }
            sb.append(" |");
            idx++;
        }
        consumer.ConsumerString(sb.toString());
    }

    private static int[] columnWidthsByContent(
            String[] columnNames,
            List<String[]> rows,
            int maxColumnWidth) {
        // fill width with field names first
        final int[] colWidths = Stream.of(columnNames).mapToInt(String::length).toArray();

        // fill column width with real data
        for (String[] row : rows) {
            for (int i = 0; i < row.length; ++i) {
                colWidths[i] = Math.max(colWidths[i], getStringDisplayWidth(row[i]));
            }
        }

        // adjust column width with maximum length
        for (int i = 0; i < colWidths.length; ++i) {
            colWidths[i] = Math.min(colWidths[i], maxColumnWidth);
        }

        return colWidths;
    }

    public static void ParseResults(TableResult result, Iterator<Row> it, StringConsumer consumer) throws IOException {
        final int[] colWidths;
        // PRINT
        final List<TableColumn> columns = result.getTableSchema().getTableColumns();
        final String[] columnNames = columns.stream().map(TableColumn::getName).toArray(String[]::new);

        final List<Row> rows = new ArrayList<>();
        final List<String[]> content = new ArrayList<>();
        content.add(columnNames);

        while (it.hasNext()) {
            Row row = it.next();
            rows.add(row);
            content.add(rowToString(row, NULL_COLUMN));
        }
        colWidths = columnWidthsByContent(columnNames, content, MAX_COLUMN_WIDTH);
        it = rows.iterator();


        final String borderline = genBorderLine(colWidths);
        // print border line
        consumer.ConsumerString(borderline);

        // print field names
        printSingleRow(colWidths, columnNames, consumer);

        // print border line
        consumer.ConsumerString(borderline);


        long numRows = 0;
        while (it.hasNext()) {
            String[] cols = rowToString(it.next(), NULL_COLUMN);

            // print content
            printSingleRow(colWidths, cols, consumer);

            numRows++;
        }

        if (numRows > 0) {
            // print border line
            consumer.ConsumerString(borderline);
        }

        final String rowTerm;
        if (numRows > 1) {
            rowTerm = "rows";
        } else {
            rowTerm = "row";
        }
        consumer.ConsumerString(numRows + " " + rowTerm + " in set");
    }
}
