import { client } from './ddb-client';
import { Entity } from 'electrodb';

const table = `${env}-${process.env.DYNAMODB_TABLE_CITIES}`;

export const DynamoCities = new Entity(
  {
    model: {
      entity: 'DynamoCities',
      service: 'database',
      version: '01'
    },
    attributes: {
      name: { type: 'string' },
      state: { type: 'string' },
      latest_census_zone: { type: 'number' }
    },
    indexes: {
      primary: { pk: { field: 'id', composite: ['id'], template: '${id}' } },
      customers: {
        index: 'customer-created',
        pk: { field: 'id', composite: ['id'], template: '${id}' },
        sk: { field: 'state', composite: ['state'], template: '${state}' }
      },
      censusZone: {
        index: 'census_zone-index',
        pk: {
          field: 'idx-latest_census_zone',
          composite: ['idx-latest_census_zone'],
          template: '${idx-latest_census_zone}'
        },
        sk: { field: 'state', composite: ['state'], template: '${state}' }
      }
    }
  },
  { client, table }
);
