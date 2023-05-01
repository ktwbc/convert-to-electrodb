import fs from 'fs';

export const importLines = (filePath: string): string[] => {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return fileContent.split('\n');
};
