import { GenericField } from '../../interface/generic';
import { getPairedLines } from './get-paired-lines';
import { findEndingInColon } from '../find-ending-in-colon';

export const findFields = (lines: string[]): GenericField[] => {
  let fieldLines = getPairedLines(lines, '@Decorator.Attribute');

  return fieldLines.map((item) => {
    let genericField: GenericField = { name: '', type: '' };

    genericField.name = findEndingInColon(item[1]);

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
