import { last, negate } from 'lodash';
import { Cell, CellPredicate, Direction } from '../types';
import runTo from './runTo';

interface Nearest {
  <T extends Cell>(
    start: Cell,
    direction: Direction,
    predicate: CellPredicate<T>,
  ): T | undefined;
  (start: Cell, direction: Direction, predicate: CellPredicate):
    | Cell
    | undefined;
}

/**
 * Returns the nearest orthogonally connected cell which matches a predicate
 */
const nearest: Nearest = (
  start: Cell,
  direction: Direction,
  predicate: CellPredicate,
) => {
  const inversePredicate = negate(predicate);
  const run = runTo(start, direction, inversePredicate);
  const finalRunCell = last(run) || start;
  const next = finalRunCell?.neighbors[direction];

  return next;
};

export default nearest;
