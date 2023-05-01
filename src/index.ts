import { readFolder, importLines, dynamoTypesToGeneric } from './lib';
import { buildAttributes } from './lib/build-attributes';
import { genericToElectroDb } from './lib/generic-to-electro-db';

const main = () => {
  const folderPath = './files/input';
  const fileNames = readFolder(folderPath);

  for (let fileName of fileNames) {
    console.log(fileName);

    const filePath = `${folderPath}/${fileName}`;
    const lines = importLines(filePath);

    // Convert to a generic format
    let generic = dynamoTypesToGeneric(lines);
    let electroSchema = genericToElectroDb(generic);

    console.log(generic);
    console.log(electroSchema);
  }
};

main();
