import { Generic, GenericField } from '../../interface/generic';

export const buildAttributes = (objGeneric: Generic) => {
  return objGeneric.fields.reduce((accumulator, field: GenericField) => {
    accumulator[field.name] = {
      type: field.type
    };
    if (field.dbName) {
      accumulator[field.name]['dbName'] = field.dbName;
    }
    return accumulator;
  }, {});
};

// return {
//   id: { type: 'string' },
//   status: { type: 'string' }
// };
