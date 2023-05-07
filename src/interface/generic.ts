export interface GenericField {
  name: string;
  type: string;
  dbName?: string; // database field name if different than name
}

export enum IndexType {
  'hash' = 'hash',
  'full' = 'full',
  'lsi' = 'lsi',
  'gsi' = 'gsi'
}

export interface GenericIndex {
  name: string; // variable name from model file
  indexName: string; // only for gsi or lsi
  type: IndexType;
  pk: string;
  sk?: string;
}

export interface Generic {
  tableName: string;
  modelName: string;
  fields: GenericField[];
  indexes: GenericIndex[];
}
