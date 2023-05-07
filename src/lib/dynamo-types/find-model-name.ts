export const findModelName = (lines: string[]) => {
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
