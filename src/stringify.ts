import { DOT_CHAR, markCharMap, SPACE_CHAR } from './constants';
import { Cell, Puzzle } from './types';
import { isDotted, isMarked, isMarker } from './util';

const stringifyCell = (cell: Cell): string => {
  if (isMarker(cell)) return cell.size.toString();
  if (isMarked(cell)) return markCharMap[cell.markedFrom];
  if (isDotted(cell)) return DOT_CHAR;

  return SPACE_CHAR;
};

const stringify = (puzzle: Puzzle): string => {
  let leftmostCell: Cell = puzzle.markers[0];

  while (leftmostCell.neighbors.left) {
    leftmostCell = leftmostCell.neighbors.left;
  }

  while (leftmostCell.neighbors.up) {
    leftmostCell = leftmostCell.neighbors.up;
  }

  const rows: string[] = [];

  do {
    let row = '';
    let cell = leftmostCell;

    do {
      row += stringifyCell(cell);
      cell = cell.neighbors.right!;
    } while (cell);

    rows.push(row);
    leftmostCell = leftmostCell.neighbors.down!;
  } while (leftmostCell);

  return rows.join('\n');
};

export default stringify;
