import * as fs from 'fs';

export const readFolder = (folderPath: string): string[] => {
  const files = fs.readdirSync(folderPath);
  const fileNames: string[] = [];

  for (const file of files) {
    const filePath = `${folderPath}/${file}`;
    const stats = fs.statSync(filePath);
    if (stats.isFile()) {
      fileNames.push(file);
    }
  }

  return fileNames;
};
