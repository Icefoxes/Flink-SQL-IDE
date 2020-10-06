import { ResourceTable, ResourceUDF, Tab } from '../../model';
import { Job } from '../../model/job.model';
import { StreamNode, StreamNodeType } from '../../model/tree.model';

export const RESOURCE_NDOES: StreamNode[] = [
    {
        name: 'Resources',
        nodeType: StreamNodeType.ResourceRoot,
        children: [
            {
                name: 'Source',
                nodeType: StreamNodeType.SourceRoot,
                children: [
                ]
            },
            {
                name: 'Sink',
                nodeType: StreamNodeType.SinkRoot,
                children: [
                ]
            },
            {
                name: 'UDF',
                nodeType: StreamNodeType.UDFRoot,
                children: []
            }
        ]
    }
];


export const PROJECT_NODES: StreamNode[] = [
    {
        name: 'Projects',
        nodeType: StreamNodeType.ProjectRoot,
        children: []
    }
];

export const SESSION: StreamNode = {
    name: 'default_catalog',
    nodeType: StreamNodeType.SessionCatalog,
    children: [
        {
            name: 'default_database',
            nodeType: StreamNodeType.SessionDatabase,
            children: [
                {
                    name: 'UserLog',
                    nodeType: StreamNodeType.SessionTable,
                    children: [
                        { name: 'UserId', nodeType: StreamNodeType.SessionColumn },
                        { name: 'ItemId', nodeType: StreamNodeType.SessionColumn }
                    ]
                }
            ]
        },
    ]
};

const SQL = `CREATE TABLE UserData (
    user_id STRING,
    item_id STRING,
    category_id STRING,
    behavior STRING
) WITH (
    'connector' = 'kafka',
    'topic' = 'user_data',
    'properties.bootstrap.servers' = 'localhost:9092',
    'properties.group.id' = 'testGroup',
    'format' = 'json',
    'scan.startup.mode' = 'earliest-offset'
)

CREATE TABLE LocalFiles (
  user_id STRING,
  item_id STRING,
  category_id STRING,
  behavior STRING
) PARTITIONED BY (user_id) WITH (
  'connector' = 'filesystem',           -- required: specify the connector
  'path' = 'file:///c:/tmp',            -- required: path to a directory
  'format' = 'json'                      -- required: file system connector requires to specify a format,
                                        -- Please refer to Table Formats
                                        -- section for more details
)


INSERT INTO LocalFiles
SELECT *
FROM UserData
`;

const UDF_JAVA = `import org.apache.flink.table.functions.ScalarFunction;

// function with overloaded evaluation methods
public static class SumFunction extends ScalarFunction {

  public Integer eval(Integer a, Integer b) {
    return a + b;
  }

  public Integer eval(String a, String b) {
    return Integer.valueOf(a) + Integer.valueOf();
  }

  public Integer eval(Double... d) {
    double result = 0;
    for (double value : d)
      result += value;
    return (int) result;
  }
}
`;

export const LOCAL_TABS: Tab[] = [
    {
        title: 'UserData.sql',
        content: SQL,
        language: 'sql',
        active: true,
        canEdit: false
    },
    {
        title: 'Sum.java',
        content: UDF_JAVA,
        language: 'java',
        active: false
    }
];

export const UDF: ResourceUDF = {
    title: 'Sum.java',
    language: 'java',
    content: UDF_JAVA
};

export const JOBS: Job[] = [
    {
        name: 'UserData.sql',
        readonly: true,
        content: SQL,
        saved: SQL,
        updatedAt: new Date(),
        updatedBy: 'admin',
        approved: false,
    }
];

export const KAFKA_TABLE: ResourceTable = {
    name: 'UserData',
    columns: [
        {
            name: 'user_id',
            type: 'string'
        },
        {
            name: 'item_id',
            type: 'string'
        }
    ],
    type: 'kafka',
    props: {
        connector: 'kafka',

    }
};

export const FILE_TABLE: ResourceTable = {
    name: 'UserLog',
    columns: [
        {
            name: 'user_id',
            type: 'string'
        },
        {
            name: 'item_id',
            type: 'string'
        }
    ],
    type: 'filesystem',
    props: {
        connector: 'filesystem',
    }
};
