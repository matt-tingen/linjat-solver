/* eslint-disable no-console */
import chalk from 'chalk';
import {
  Diff,
  DIFF_DELETE,
  DIFF_EQUAL,
  DIFF_INSERT,
  diffStringsRaw,
} from 'jest-diff';
import { SPACE_CHAR } from './constants';
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

const logPuzzleSection = (name: string, puzzleString: string) => {
  console.log([`${name}:`, '', puzzleString, ''].join('\n'));
};

const stringifyPuzzleForOutput = (puzzle: Puzzle) => {
  const diffs = stringify(puzzle)
    .split('')
    .map((text) => ({ 0: DIFF_EQUAL, 1: text }));

  return stringifyPuzzleDiffs(diffs);
};

const splitDiff = (diff: Diff): Diff[] =>
  diff[1].split('').map((char) => ({ ...diff, 1: char }));

const stringifyPuzzleDiffs = (diffs: Diff[]) => {
  const parts = diffs
    .flatMap(splitDiff)
    .filter((d) => d[0] !== DIFF_DELETE)
    .map(({ 0: type, 1: text }) => {
      if (type === DIFF_INSERT) {
        return chalk.green.bold(text);
      }

      if (text === SPACE_CHAR) {
        return chalk.dim('-');
      }

      return text;
    });

  return parts.join('');
};

logPuzzleSection('Initial', stringifyPuzzleForOutput(initial));

let previous = stringify(initial);

solve(initial, (partial, ops, i) => {
  const name = `Step ${i + 1}`;

  const next = stringify(partial);
  const diffs = diffStringsRaw(previous, next, false);

  logPuzzleSection(name, stringifyPuzzleDiffs(diffs));

  previous = next;
});
