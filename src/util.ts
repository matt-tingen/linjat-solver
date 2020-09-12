import {
  Cell,
  Direction,
  MarkedCell,
  DottedCell,
  MarkableCell,
  MarkerCell,
} from './types';

const opposites: Record<Direction, Direction> = {
  up: 'down',
  right: 'left',
  down: 'up',
  left: 'right',
};

export const opposite = (direction: Direction) => opposites[direction];

export const isTerminal = (cell: Cell): cell is MarkedCell => {
  if (isMarked(cell)) {
    const oppositeCell = cell.neighbors[opposite(cell.markedFrom)];
    const isTerminal = !(oppositeCell && isMarked(oppositeCell));

    return isTerminal;
  }

  return false;
};

export const isDotted = (cell: Cell): cell is DottedCell =>
  Boolean(isMarkable(cell) && cell.dotted);

export const isMarkable = (cell: Cell): cell is MarkableCell =>
  cell.type === 'markable';

export const isMarked = (cell: Cell): cell is MarkedCell =>
  Boolean(isMarkable(cell) && cell.markedFrom);

export const isMarker = (cell: Cell): cell is MarkerCell =>
  cell.type === 'marker';
