import { readFolder, importLines, dynamoTypesToGeneric } from './lib';
import { genericToElectroDb } from './lib/electrodb/generic-to-electro-db';
import * as path from 'path';

const main = () => {
  const folderPathInput = './files/input';
  const fileNames = readFolder(folderPathInput).filter((item) => item.includes('.ts') || item.includes('.js'));

  for (let fileName of fileNames) {
    try {
      const filePath = `${folderPathInput}/${fileName}`;
      const lines = importLines(filePath);

      // Convert to a generic (universal) structure
      let generic = dynamoTypesToGeneric(lines);

      // Convert generic to ElectroDB format
      genericToElectroDb(generic, path.join(__dirname, '../files/output'));
      console.log(`Successfully converted ${fileName}`);
    } catch (error) {
      console.error(`Error on file ${fileName}`, error.message);
    }
  }
};

main();
