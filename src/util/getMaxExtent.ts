import { Direction, MarkerCell } from '../types';
import getMarks from './getMarks';
import { flip, getPerpendicularDirections, isMarkable, runTo } from '.';

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

export default getMaxExtent;
