import { sum } from 'lodash';
import { MarkerCell, Puzzle } from './types';
import getMarks from './util/getMarks';

const isFullyMarked = (marker: MarkerCell) =>
  sum(Object.values(getMarks(marker))) === marker.size - 1;

const verify = (puzzle: Puzzle) =>
  puzzle.dots.every((dot) => dot.markedFrom) &&
  puzzle.markers.every(isFullyMarked);

export default verify;
