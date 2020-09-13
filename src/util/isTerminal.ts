import { Cell, MarkedCell } from '../types';
import { isMarked, opposite } from '.';

const isTerminal = (cell: Cell): cell is MarkedCell => {
  if (isMarked(cell)) {
    const oppositeCell = cell.neighbors[opposite(cell.markedFrom)];
    const isTerminal = !(oppositeCell && isMarked(oppositeCell));

    return isTerminal;
  }

  return false;
};

export default isTerminal;
