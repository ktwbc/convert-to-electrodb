import { client } from './ddb-client';
import { Entity } from 'electrodb';

const table = 'blog-posts';

export const BlogPosts = new Entity(
  {
    model: {
      entity: 'BlogPosts',
      service: 'database',
      version: '01'
    },
    attributes: {
      id: { type: 'string' },
      title: { type: 'string' },
      publish_date: { type: 'object' },
      contents: { type: 'string', dbName: 'body' },
      code: { type: 'string' },
      codeType: { type: 'string', dbName: 'code_type' }
    },
    indexes: {
      primary: {
        pk: { field: 'id', composite: ['id'], template: '${id}' },
        sk: {
          field: 'publish_date',
          composite: ['publish_date'],
          template: '${publish_date}'
        }
      },
      code: {
        index: 'code-code_type',
        pk: { field: 'code', composite: ['code'], template: '${code}' },
        sk: {
          field: 'code_type',
          composite: ['code_type'],
          template: '${code_type}'
        }
      },
      managerId: {
        index: 'idx_author_id',
        pk: {
          field: 'author_id',
          composite: ['author_id'],
          template: '${author_id}'
        },
        sk: { field: 'id', composite: ['id'], template: '${id}' }
      }
    }
  },
  { client, table }
);
