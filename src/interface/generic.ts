export interface GenericField {
  name: string;
  type: string;
  dbName?: string; // database field name if different than name
}

export interface GenericIndex {
  name: string;
  type: string; // gsi or lsi
  pk: string;
  sk?: string;
}

export interface Generic {
  tableName: string;
  modelName: string;
  fields: GenericField[];
  indexes: GenericIndex[];
}
