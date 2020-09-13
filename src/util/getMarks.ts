import { Direction, MarkerCell } from '../types';
import { directions, flip, isMarkable, runTo } from '.';

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

export default getMarks;
