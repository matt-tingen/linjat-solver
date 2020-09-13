import { MarkerCell } from '../types';
import mapDirections from './mapDirections';
import { flip, isMarkable, runTo } from '.';

const getMarks = (marker: MarkerCell) =>
  mapDirections((dir) => {
    const opposite = flip(dir);
    const run = runTo(
      marker,
      dir,
      (cell) => isMarkable(cell) && cell.markedFrom === opposite,
    );

    return run.length;
  });

export default getMarks;
