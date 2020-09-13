import { Cell, Direction, MarkedCell, MarkerCell } from '../types';
import { directions, flip, getPerpendicularDirections } from './directions';
import runTo from './runTo';
import { isMarkable } from './typeGuards';

interface Measurement {
  direction: Direction;
  distance: number;
}

const measure = (start: Cell, dest: Cell): Measurement | undefined => {
  if (start === dest) throw new Error('Cannot measure from a cell to itself');

  const { x: startX, y: startY } = start.coordinates;
  const { x: destX, y: destY } = dest.coordinates;

  if (startX === destX) {
    const direction = startY > destY ? 'up' : 'down';
    const distance = Math.abs(startY - destY);

    return { direction, distance };
  }

  if (startY === destY) {
    const direction = startX > destX ? 'left' : 'right';
    const distance = Math.abs(startX - destX);

    return { direction, distance };
  }
};

const getMarks = (marker: MarkerCell) =>
  Object.fromEntries(
    directions.map((dir) => {
      const opposite = flip(dir);
      const run = runTo(
        marker,
        dir,
        (cell) => isMarkable(cell) && cell.markedFrom === opposite,
      );

      return [dir, run.length];
    }),
  ) as Record<Direction, number>;

const getMaxExtent = (marker: MarkerCell, direction: Direction): number => {
  const marks = getMarks(marker);

  const perpendiculars = getPerpendicularDirections(direction);

  if (perpendiculars.some((dir) => marks[dir])) return 0;

  const opposite = flip(direction);
  const run = runTo(
    marker,
    direction,
    (cell) =>
      isMarkable(cell) && (!cell.markedFrom || cell.markedFrom === opposite),
  );
  const availableSpace = run.length;
  const maxExtent = Math.min(marker.size - 1, availableSpace - marks[opposite]);

  return maxExtent;
};

const canReach = (marker: MarkerCell, destination: Cell) => {
  const orientation = measure(marker, destination);

  if (!orientation) {
    return false;
  }

  const { distance, direction } = orientation;
  const maxExtent = getMaxExtent(marker, direction);

  return distance <= maxExtent;
};

export default canReach;
