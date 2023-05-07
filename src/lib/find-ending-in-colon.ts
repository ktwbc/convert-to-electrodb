export const findEndingInColon = (str: string) => {
  let fieldMatch = str.match(/^(.+):/);
  let arrStrings = fieldMatch[1].trim().split(' ');
  return arrStrings.pop();
};
