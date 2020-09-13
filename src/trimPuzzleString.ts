const trimPuzzleString = (string: string) =>
  string
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .join('\n');

export default trimPuzzleString;
