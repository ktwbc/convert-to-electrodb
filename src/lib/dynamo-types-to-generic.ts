import { Generic, GenericField, GenericIndex } from '../interface/generic';

// Search for a model line with its pair that includes the search string
const getPairedLines = (lines: string[], searchString: string) =>
  lines
    .map((line, index) => {
      if (line.includes(searchString)) {
        return [line, lines[index + 1]];
      }
      return null;
    })
    .filter((line) => line !== null);

const findTableName = (lines: string[]) => {
  const targetLine = lines.find((line) => line.includes('@Decorator.Table'));
  if (targetLine !== undefined) {
    let pattern = /:.+([^']+)}/;
    let extract = lines[lines.indexOf(targetLine)].match(pattern);
    if (extract !== null) {
      return extract[0].slice(1).slice(0, -1).trim(); // trim off colon and }
    }
  }
  throw new Error('Title not found in model file, looking for line containing: @Decorator.Table');
};

const findModelName = (lines: string[]) => {
  const targetLine = lines.find((line) => line.includes('extends Table'));
  if (targetLine !== undefined) {
    let pattern = /class\s+(\w+)\s+extends/;
    let extract = lines[lines.indexOf(targetLine)].match(pattern);
    if (extract !== null) {
      return extract[0].slice(5).slice(0, -7).trim(); // trim off "class" and "extends"
    }
  }
  throw new Error('Entity name not found in model file, looking for line containing: extends Table');
};

const findFields = (lines: string[]): GenericField[] => {
  let fieldLines = getPairedLines(lines, '@Decorator.Attribute');

  return fieldLines.map((item) => {
    let genericField: GenericField = { name: '', type: '' };

    let fieldMatch = item[1].match(/^(.+):/);
    genericField.name = fieldMatch[0].slice(0, -1).trim();

    let typeMatch = item[1].match(/:.+(.+);/);
    genericField.type = typeMatch[0].trim().slice(1).slice(0, -1).trim();
    if (genericField.type.includes(' ')) {
      // if our class has multiple types, just use first one
      genericField.type = genericField.type.split(' ')[0].trim();
    }

    // Find a name override if it exists
    let extract = item[0].match(/name:.+([^']+)}/);
    if (extract !== null) {
      let dbName = extract[0].trim().slice(5).slice(0, -1).trim().slice(1).slice(0, -1); // trim off colon and }
      if (dbName !== genericField.name) {
        genericField.dbName = dbName;
      }
    }

    return genericField;
  });
};

const findIndexes = (lines: string[]): GenericIndex[] => {
  let hashLines = getPairedLines(lines, '@Decorator.HashPrimaryKey');
  let fullLines = getPairedLines(lines, '@Decorator.FullPrimaryKey');
  let lsiLines = getPairedLines(lines, '@Decorator.LocalSecondaryIndex');
  let gsiLines = getPairedLines(lines, '@Decorator.FullGlobalSecondaryIndex');

  let indexArray: GenericIndex[] = [];
  let pkSave: string;

  if (hashLines.length) {
    hashLines.map((item) => {
      let genericIndex: GenericIndex = { name: 'primary', pk: '', type: 'hash' };

      let extract = item[0].match(/('([^']*)')/g);
      genericIndex.pk = extract[0].trim().slice(1).slice(0, -1).trim();
      pkSave = genericIndex.pk;
      indexArray.push(genericIndex);
    });
  }

  if (fullLines.length) {
    fullLines.map((item) => {
      let genericIndex: GenericIndex = { name: 'primary', pk: '', sk: '', type: 'full' };
      // @Decorator.FullPrimaryKey('id', 'publish_date')",

      let extract = item[0].match(/('([^']*)')/g);
      genericIndex.pk = extract[0].trim().slice(1).slice(0, -1).trim();
      genericIndex.sk = extract[1].trim().slice(1).slice(0, -1).trim();
      pkSave = genericIndex.pk;
      indexArray.push(genericIndex);
    });
  }

  if (lsiLines.length) {
    lsiLines.map((item) => {
      let genericIndex: GenericIndex = { name: '', pk: pkSave, sk: '', type: 'lsi' };
      // @Decorator.FullGlobalSecondaryIndex('code', 'code_type', { name: 'code-code_type' })

      let extract = item[0].match(/('([^']*)')/g);
      genericIndex.sk = extract[0].trim().slice(1).slice(0, -1).trim();
      genericIndex.name = extract[1] ? extract[1].trim().slice(1).slice(0, -1).trim() : '';
      indexArray.push(genericIndex);
    });
  }

  if (gsiLines.length) {
    gsiLines.map((item) => {
      let genericIndex: GenericIndex = { name: '', pk: '', sk: '', type: 'gsi' };
      // @Decorator.FullGlobalSecondaryIndex('code', 'code_type', { name: 'code-code_type' })

      let extract = item[0].match(/('([^']*)')/g);
      genericIndex.pk = extract[0].trim().slice(1).slice(0, -1).trim();
      genericIndex.sk = extract[1].trim().slice(1).slice(0, -1).trim();
      genericIndex.name = extract[2] ? extract[2].trim().slice(1).slice(0, -1).trim() : '';
      indexArray.push(genericIndex);
    });
  }

  return indexArray;
};

export const dynamoTypesToGeneric = (lines: string[]): Generic => {
  let objGeneric: Generic = {
    fields: [],
    indexes: [],
    modelName: '',
    tableName: ''
  };

  objGeneric.tableName = findTableName(lines);
  objGeneric.modelName = findModelName(lines);
  objGeneric.fields = findFields(lines);
  objGeneric.indexes = findIndexes(lines);

  return objGeneric;
};
