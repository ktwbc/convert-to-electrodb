export const findTableName = (lines: string[]) => {
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
