import { Generic, GenericField, GenericIndex } from '../../interface/generic';
import { buildAttributes } from './build-attributes';
import ejs from 'ejs';
import fs from 'fs';
import util from 'util';
import * as prettier from 'prettier';
import { buildIndexes } from './build-indexes';

export const genericToElectroDb = (objGeneric: Generic, outputPath: string): any => {
  let objData = {
    tableName: objGeneric.tableName,
    modelName: objGeneric.modelName,
    attributes: buildAttributes(objGeneric),
    indexes: buildIndexes(objGeneric)
  };
  let template = fs.readFileSync('./src/schemas/model.ts__tmpl__', 'utf-8');

  let rendered = ejs.render(template, objData, { escape: (markup: string) => markup });
  rendered = prettier.format(rendered, {
    parser: 'typescript',
    singleQuote: true,
    trailingComma: 'all'
  });

  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }
  fs.writeFileSync(`${outputPath}/${objGeneric.modelName}.ts`, rendered);
  // Place in the ddb client file
  fs.writeFileSync(`${outputPath}/ddb-client.ts`, fs.readFileSync('./src/schemas/ddb-client.ts__tmpl__', 'utf-8'));

  return `Files written to ${outputPath}`;
};
