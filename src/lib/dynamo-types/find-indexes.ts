import { GenericIndex, IndexType } from '../../interface/generic';
import { getPairedLines } from './get-paired-lines';
import { findEndingInColon } from '../find-ending-in-colon';

export const findIndexes = (lines: string[]): GenericIndex[] => {
  let hashLines = getPairedLines(lines, '@Decorator.HashPrimaryKey');
  let fullLines = getPairedLines(lines, '@Decorator.FullPrimaryKey');
  let lsiLines = getPairedLines(lines, '@Decorator.LocalSecondaryIndex');
  let gsiLines = getPairedLines(lines, '@Decorator.FullGlobalSecondaryIndex');

  let indexArray: GenericIndex[] = [];
  let pkSave: string;

  if (hashLines.length) {
    hashLines.map((item) => {
      let genericIndex: GenericIndex = { name: 'primary', indexName: '', pk: '', type: IndexType.hash };

      let extract = item[0].match(/('([^']*)')/g);
      genericIndex.pk = extract[0].trim().slice(1).slice(0, -1).trim();
      pkSave = genericIndex.pk;
      indexArray.push(genericIndex);
    });
  }

  if (fullLines.length) {
    fullLines.map((item) => {
      let genericIndex: GenericIndex = { name: 'primary', indexName: '', pk: '', sk: '', type: IndexType.full };
      // @Decorator.FullPrimaryKey('id', 'publish_date')"
      //  public static readonly keyPlusDate: Query.FullPrimaryKey<BlogPosts, string, string>;

      let extract = item[0].match(/('([^']*)')/g);
      genericIndex.pk = extract[0].trim().slice(1).slice(0, -1).trim();
      genericIndex.sk = extract[1].trim().slice(1).slice(0, -1).trim();

      pkSave = genericIndex.pk;
      indexArray.push(genericIndex);
    });
  }

  if (lsiLines.length) {
    lsiLines.map((item) => {
      let genericIndex: GenericIndex = { name: '', indexName: '', pk: pkSave, sk: '', type: IndexType.lsi };
      // @Decorator.FullGlobalSecondaryIndex('code', 'code_type', { name: 'code-code_type' })

      let extract = item[0].match(/('([^']*)')/g);
      genericIndex.sk = extract[0].trim().slice(1).slice(0, -1).trim();
      genericIndex.indexName = extract[1] ? extract[1].trim().slice(1).slice(0, -1).trim() : '';

      genericIndex.name = findEndingInColon(item[1]);

      indexArray.push(genericIndex);
    });
  }

  if (gsiLines.length) {
    gsiLines.map((item) => {
      let genericIndex: GenericIndex = { name: '', indexName: '', pk: '', sk: '', type: IndexType.gsi };
      // @Decorator.FullGlobalSecondaryIndex('code', 'code_type', { name: 'code-code_type' })

      let extract = item[0].match(/('([^']*)')/g);
      genericIndex.pk = extract[0].trim().slice(1).slice(0, -1).trim();
      genericIndex.sk = extract[1].trim().slice(1).slice(0, -1).trim();
      genericIndex.indexName = extract[2] ? extract[2].trim().slice(1).slice(0, -1).trim() : '';

      genericIndex.name = findEndingInColon(item[1]);

      indexArray.push(genericIndex);
    });
  }

  return indexArray;
};
