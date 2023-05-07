// Search for a model line with its pair that includes the search string
export const getPairedLines = (lines: string[], searchString: string) =>
  lines
    .map((line, index) => {
      if (line.includes(searchString)) {
        return [line, lines[index + 1]];
      }
      return null;
    })
    .filter((line) => line !== null);
