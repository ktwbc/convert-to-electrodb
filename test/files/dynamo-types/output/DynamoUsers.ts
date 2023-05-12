import { client } from './ddb-client';
import { Entity } from 'electrodb';

const table = process.env.DYNAMODB_TABLE_USERS;

export const DynamoUsers = new Entity(
  {
    model: {
      entity: 'DynamoUsers',
      service: 'database',
      version: '01'
    },
    attributes: {
      id: { type: 'string' },
      first_name: { type: 'string' },
      last_name: { type: 'string' },
      phoneNumber: { type: 'number', dbName: 'phone_number' },
      city: { type: 'string' },
      state: { type: 'string' },
      zip: { type: 'number', dbName: 'zip_code' }
    },
    indexes: {
      primary: { pk: { field: 'id', composite: ['id'], template: '${id}' } }
    }
  },
  { client, table }
);
