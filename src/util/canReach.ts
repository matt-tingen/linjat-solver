import { Cell, Direction, MarkerCell } from '../types';
import getMaxExtent from './getMaxExtent';

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
