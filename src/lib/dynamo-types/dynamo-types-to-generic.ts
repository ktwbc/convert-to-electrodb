import { Generic } from '../../interface/generic';
import { findTableName } from './find-table-name';
import { findModelName } from './find-model-name';
import { findFields } from './find-fields';
import { findIndexes } from './find-indexes';

export const dynamoTypesToGeneric = (lines: string[]): Generic => {
  let objGeneric: Generic = {
    tableName: '',
    modelName: '',
    fields: [],
    indexes: []
  };

  objGeneric.tableName = findTableName(lines);
  objGeneric.modelName = findModelName(lines);
  objGeneric.fields = findFields(lines);
  objGeneric.indexes = findIndexes(lines);

  return objGeneric;
};
