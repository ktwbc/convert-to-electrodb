import { client } from '../ddb-client';
import { Entity } from 'electrodb';

const table = `blog-posts`;

export const BlogPosts = new Entity(
  {
    model: {
      entity: 'BlogPosts',
      service: 'database',
      version: '01'
    },
    attributes: {
      id: { type: 'string' },
      status: { type: 'string' }
    },
    indexes: {
      tokens: {
        pk: {
          field: 'id',
          composite: ['id'],
          template: '${id}'
        }
      }
    }
  },
  { client, table }
);
