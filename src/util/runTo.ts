import { Cell, CellPredicate, Direction } from '../types';

interface RunTo {
  <T extends Cell>(
    start: Cell,
    direction: Direction,
    predicate: CellPredicate<T>,
  ): T[];
  (start: Cell, direction: Direction, predicate?: CellPredicate): Cell[];
}

/**
 * Returns an array of cells which are orthogonally connected to the given
 * cell in the given direction.
 *
 * The given cell is _not_ included in the array.
 */
const runTo: RunTo = (
  start: Cell,
  direction: Direction,
  predicate: CellPredicate = () => true,
) => {
  const run: Cell[] = [];
  let cell = start;

  do {
    const next = cell.neighbors[direction];

    if (next && predicate(next)) {
      run.push(next);
      cell = next;
    } else {
      cell = null!;
    }
  } while (cell);

  return run;
};

export default runTo;
