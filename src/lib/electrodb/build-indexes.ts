import { Generic, GenericIndex, IndexType } from '../../interface/generic';

export const buildIndexes = (objGeneric: Generic) => {
  return objGeneric.indexes.reduce((accumulator, index: GenericIndex) => {
    switch (index.type) {
      case IndexType.hash:
        accumulator[index.name] = {
          pk: {
            field: index.pk,
            composite: [index.pk],
            template: '${' + index.pk + '}'
          }
        };
        break;
      case IndexType.full:
        accumulator[index.name] = {
          pk: {
            field: index.pk,
            composite: [index.pk],
            template: '${' + index.pk + '}'
          },
          sk: {
            field: index.sk,
            composite: [index.sk],
            template: '${' + index.sk + '}'
          }
        };
        break;
      case IndexType.lsi:
      case IndexType.gsi:
        accumulator[index.name] = {
          index: index.indexName,
          pk: {
            field: index.pk,
            composite: [index.pk],
            template: '${' + index.pk + '}'
          },
          sk: {
            field: index.sk,
            composite: [index.sk],
            template: '${' + index.sk + '}'
          }
        };
        break;
    }

    return accumulator;
  }, {});
};
