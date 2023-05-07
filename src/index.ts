import { readFolder, importLines, dynamoTypesToGeneric } from './lib';
import { genericToElectroDb } from './lib/electrodb/generic-to-electro-db';
import * as path from 'path';

const main = () => {
  const folderPathInput = './files/input';
  const fileNames = readFolder(folderPathInput).filter((item) => item.includes('.ts') || item.includes('.js'));

  for (let fileName of fileNames) {
    const filePath = `${folderPathInput}/${fileName}`;
    const lines = importLines(filePath);

    // Convert to a generic (universal) structure
    let generic = dynamoTypesToGeneric(lines);

    // Convert generic to ElectroDB format
    let response = genericToElectroDb(generic, path.join(__dirname, '../files/output'));

    console.log(response);
  }
};

main();
