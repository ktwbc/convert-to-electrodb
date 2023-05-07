import { dynamoTypesToGeneric, importLines, readFolder } from '../src/lib';
import * as fs from 'fs';
import * as ejs from 'ejs';
import { Generic, IndexType } from '../src/interface/generic';
import { buildAttributes } from '../src/lib/electrodb/build-attributes';
import { buildIndexes } from '../src/lib/electrodb/build-indexes';

describe('dynamo-types test', () => {
  it('should read files in folder', () => {
    const folderPath = './test/files/dynamo-types/input';
    const fileNames = readFolder(folderPath);

    expect(Object.keys(fileNames)).toHaveLength(3);
    expect(fileNames).toEqual(expect.arrayContaining(['blog-posts.ts', 'DynamoUsers.ts', 'DynamoCities.ts']));
  });

  it('should read in lines of ORM file', () => {
    const filePath = './test/files/dynamo-types/input/blog-posts.ts';
    const lines = importLines(filePath);

    expect(Object.keys(lines)).toHaveLength(44);
    expect(lines[3]).toBe("@Decorator.Table({ name: 'blog-posts' })");
    expect(lines[4]).toBe('export class BlogPosts extends Table {');
  });

  it('should build an generic model structure for blog-posts', () => {
    const blogLines = importLines('./test/files/dynamo-types/input/blog-posts.ts');

    let generic = dynamoTypesToGeneric(blogLines);
    expect(Object.keys(generic)).toHaveLength(4);
    expect(generic.tableName).toBe("'blog-posts'");
    expect(generic.modelName).toBe('BlogPosts');
    expect(generic.fields).toEqual(
      expect.arrayContaining([
        { name: 'id', type: 'string' },
        { name: 'title', type: 'string' },
        { name: 'publish_date', type: 'object' },
        { name: 'contents', type: 'string', dbName: 'body' },
        { name: 'code', type: 'string' },
        { name: 'codeType', type: 'string', dbName: 'code_type' }
      ])
    );
    expect(generic.indexes).toEqual(
      expect.arrayContaining([
        { indexName: '', name: 'primary', pk: 'id', type: 'hash' },
        { indexName: '', name: 'primary', pk: 'id', sk: 'publish_date', type: 'full' },
        { indexName: 'code-code_type', name: 'code', pk: 'code', sk: 'code_type', type: 'gsi' },
        { indexName: 'idx_author_id', name: 'managerId', pk: 'author_id', sk: 'id', type: 'gsi' }
      ])
    );
  });

  it('should build an generic model structure for DynamoUsers', () => {
    const userLines = importLines('./test/files/dynamo-types/input/DynamoUsers.ts');

    let generic = dynamoTypesToGeneric(userLines);
    expect(Object.keys(generic)).toHaveLength(4);
    expect(generic.tableName).toBe('process.env.DYNAMODB_TABLE_USERS');
    expect(generic.modelName).toBe('DynamoUsers');
    expect(generic.fields).toEqual(
      expect.arrayContaining([
        { name: 'id', type: 'string' },
        { name: 'first_name', type: 'string' },
        { name: 'last_name', type: 'string' },
        { name: 'phoneNumber', type: 'number', dbName: 'phone_number' },
        { name: 'city', type: 'string' },
        { name: 'state', type: 'string' },
        { name: 'zip', type: 'number', dbName: 'zip_code' }
      ])
    );
    expect(generic.indexes).toEqual(expect.arrayContaining([{ indexName: '', name: 'primary', pk: 'id', type: 'hash' }]));
  });

  it('should build an generic model structure for DynamoCities', () => {
    const cityLines = importLines('./test/files/dynamo-types/input/DynamoCities.ts');

    let generic = dynamoTypesToGeneric(cityLines);
    expect(Object.keys(generic)).toHaveLength(4);
    expect(generic.tableName).toBe('`${env}-${process.env.DYNAMODB_TABLE_USERS}`');
    expect(generic.modelName).toBe('DynamoCities');
    expect(generic.fields).toEqual(
      expect.arrayContaining([
        { name: 'name', type: 'string' },
        { name: 'state', type: 'string' }
      ])
    );
    expect(generic.indexes).toEqual(
      expect.arrayContaining([
        { indexName: '', name: 'primary', pk: 'id', type: 'hash' },
        { indexName: 'customer-created', name: 'customers', pk: 'id', sk: 'state', type: 'lsi' }
      ])
    );
  });

  it('should convert a structure into a new template', () => {
    let objGeneric: Generic = {
      tableName: 'test-table',
      modelName: 'testTable',
      fields: [
        { name: 'id', type: 'string' },
        { name: 'title', type: 'string' },
        { name: 'publish_date', type: 'object' },
        { name: 'contents', type: 'string', dbName: 'body' },
        { name: 'code', type: 'string' },
        { name: 'codeType', type: 'string', dbName: 'code_type' }
      ],
      indexes: [{ indexName: '', name: 'primaryKey', pk: 'id', sk: 'code', type: IndexType.full }]
    };

    let objData = {
      tableName: 'test-table',
      modelName: 'testTable',
      attributes: buildAttributes(objGeneric),
      indexes: buildIndexes(objGeneric)
    };

    let template = fs.readFileSync('./src/schemas/model.ts__tmpl__', 'utf-8');

    let rendered = ejs.render(template, objData, { escape: (markup: string) => markup });
    expect(rendered).toContain('export const testTable');
    expect(rendered).toContain("entity: 'testTable'");
    expect(rendered).toContain('composite');
    expect(rendered).toContain('code');
  });
});
