/* eslint-disable no-console */
import parse from './parse';
import solve from './solve';
import stringify from './stringify';
import { Puzzle } from './types';

const initial = parse(
  `
  .........
  4..*.....
  ...*.....
  **.3...*3
  22.......
  **.5.**3*
`,
);

const logPuzzle = (name: string, puzzle: Puzzle) => {
  console.log([`${name}:`, '', stringify(puzzle), ''].join('\n'));
};

logPuzzle('Initial', initial);

solve(initial, (partial, ops, i) => {
  logPuzzle(`Step ${i + 1} (${ops.length} ops)`, partial);
});
