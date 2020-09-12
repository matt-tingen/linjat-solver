import { DOT_CHAR, SPACE_CHAR } from './constants';
import { Cell, Puzzle } from './types';
import { isDotted, isMarker } from './util';

const parseCell = (cellString: string): Cell => {
  const neighbors = {};

  if (cellString === DOT_CHAR) {
    return { type: 'markable', dotted: true, neighbors };
  }

  if (cellString === SPACE_CHAR) {
    return { type: 'markable', neighbors };
  }

  const size = parseInt(cellString, 10);

  if (Number.isNaN(size)) {
    throw new Error(`Invalid cell: ${cellString}`);
  }

  return { type: 'marker', size, neighbors };
};

const parse = (string: string): Puzzle => {
  const lines = string.trim().split('\n');
  const cells = lines.map((line) => line.trim().split('').map(parseCell));

  const height = cells.length;
  const width = cells[0].length;

  if (cells.some((row) => row.length !== width)) {
    throw new Error('Inconsistent row length');
  }

  const getCell = (x: number, y: number) => {
    const cell = cells[y]?.[x];

    if (!cell) {
      throw new Error(`Cell coordinates out of bounds: (${x}, ${y})`);
    }

    return cell;
  };

  const puzzle: Puzzle = { dots: [], markers: [], getCell };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cell = cells[y][x];

      if (isDotted(cell)) puzzle.dots.push(cell);
      if (isMarker(cell)) puzzle.markers.push(cell);

      if (x > 0) {
        cell.neighbors.left = cells[y][x - 1];
      }

      if (x < width - 1) {
        cell.neighbors.right = cells[y][x + 1];
      }

      if (y > 0) {
        cell.neighbors.up = cells[y - 1][x];
      }

      if (y < height - 1) {
        cell.neighbors.down = cells[y + 1][x];
      }
    }
  }

  return puzzle;
};

export default parse;