import getAvailableOperations from './getAvailableOperations';
import parse from './parse';
import PuzzleError from './PuzzleError';
import stringify from './stringify';
import { Operation, Puzzle } from './types';
import { isMarkable } from './util';

// Using _.cloneDeep does not handle getCell.
const clonePuzzle = (puzzle: Puzzle): Puzzle => parse(stringify(puzzle));

const executeOperations = (puzzle: Puzzle, operations: Operation[]) => {
  operations.forEach(({ coordinates, markFrom }) => {
    const cell = puzzle.getCell(coordinates);

    if (!isMarkable(cell)) {
      throw new PuzzleError(
        puzzle,
        `Cell is not markable: (${coordinates.x}, ${coordinates.y})`,
      );
    }

    if (cell.markedFrom) {
      throw new PuzzleError(
        puzzle,
        `Cell already marked: (${coordinates.x}, ${coordinates.y})`,
      );
    }

    cell.markedFrom = markFrom;
  });
};

const solve = (
  puzzle: Puzzle,
  stepListener?: (puzzle: Puzzle, operations: Operation[], i: number) => void,
): Puzzle => {
  const cloned = clonePuzzle(puzzle);
  let operations: Operation[];
  let i = 0;

  do {
    operations = getAvailableOperations(cloned);

    if (operations.length) {
      executeOperations(cloned, operations);
      stepListener?.(cloned, operations, i++);
    }
  } while (operations.length);

  return cloned;
};

export default solve;
