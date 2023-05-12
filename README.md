# convert-to-electrodb
Converter for ORM model files to ElectroDB Model files

Current supports:
* dynamo-types https://www.npmjs.com/package/dynamo-types
* others coming soon or make PR

## Directions

* Place your existing ORM files into the /files/input folder. These can be .ts or .js (note currently only .ts Dynamo-Types files are supported, PRs welcome for other file types)
* yarn install
* yarn run-conversion

Files are written to /files/output folder (created if it does not exist). There is also a generic ddb-client.ts using aws-sdk v3 that is included in the folder which model files reference.

Reference example templates under tests to see the format that the exporter expects. If you get failures, you may need to tweak your own input files to clean up so they convert better.

Sample input file:
```
import { Decorator, Query, Table } from 'dynamo-types';

import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as tz from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(tz);

@Decorator.Table({ name: process.env.DYNAMODB_TABLE_AUDIT_LOG })
export class DynamoAuditLog extends Table {
  @Decorator.FullPrimaryKey('user', 'created_at')
  public static readonly primaryKey: Query.FullPrimaryKey<DynamoAuditLog, string, number>;

  @Decorator.Writer()
  public static readonly writer: Query.Writer<DynamoAuditLog>;

  @Decorator.Attribute({ name: 'user' })
  user: string;

  @Decorator.Attribute({ name: 'ip' })
  ip: string; // human readable stamp

  @Decorator.Attribute({ name: 'created_at' })
  createdAt: number; // epoch w/ ms

  @Decorator.Attribute({ name: 'event' })
  event: AuditLogEvent;

  @Decorator.Attribute({ name: 'data' })
  data: object;

  static write(user: string, event: AuditLogEvent, token = '', data?: object): Promise<Table> {
    let objAuditLog = new DynamoAuditLog();
    objAuditLog.event = event;
    objAuditLog.day = dayjs().tz('America/Chicago').format('YYYY-MM-DD HH:mm:ss.SSS');
    objAuditLog.createdAt = dayjs().valueOf();
    if (token) {
      objAuditLog.token = token;
    }
    if (data) {
      objAuditLog.data = data;
    }
    return objAuditLog.save();
  }
}
```

Example output:

```
import { client } from './ddb-client';
import { Entity } from 'electrodb';

const table = process.env.DYNAMODB_TABLE_AUDIT_LOG;

export const DynamoAuditLog = new Entity(
  {
    model: {
      entity: 'DynamoAuditLog',
      service: 'database',
      version: '01',
    },
    attributes: {
      user: { type: 'string' },
      ip: { type: 'string' },
      createdAt: { type: 'number', dbName: 'created_at' },
      event: { type: 'AuditLogEvent' },
      data: { type: 'object' },
    },
    indexes: {
      primary: {
        pk: { field: 'user', composite: ['user'], template: '${user}' },
        sk: {
          field: 'created_at',
          composite: ['created_at'],
          template: '${created_at}',
        },
      },
    },
  },
  { client, table },
);


```

Note in this example because the original had a custom class and not primitive type on the "event" field, it would require manually updating with the new model file. 

This converter is designed to get you 90% there. Also this is not taking advantage of ElectroDB's full features but will assist in a transition. Custom additions to model files are not carried over.