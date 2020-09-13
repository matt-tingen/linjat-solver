import { DOT_PULL_REASON } from './constants';
import {
  Direction,
  MarkableCell,
  MarkerCell,
  Operation,
  Puzzle,
} from './types';
import {
  canBeMarked,
  canReach,
  directions,
  isMarker,
  nearest,
  runTo,
} from './util';

const buildOperation = (
  cell: MarkableCell,
  markFrom: Direction,
  reason: string,
): Operation => ({
  reasons: [reason],
  coordinates: cell.coordinates,
  markFrom,
});

const getAvailableOperations = (puzzle: Puzzle): Operation[] => {
  const operations: Operation[] = [];

  // dot pull ops
  puzzle.dots.forEach((dot) => {
    const cardinalMarkers = directions
      .map((dir) => [nearest(dot, dir, isMarker), dir] as const)
      .filter(([marker]) => marker) as [MarkerCell, Direction][];

    const reachableMarkers = cardinalMarkers.filter(([marker]) =>
      canReach(marker, dot),
    );

    if (reachableMarkers.length === 1) {
      const [[, dir]] = reachableMarkers;
      const markables = [dot, ...runTo(dot, dir, canBeMarked)];
      const ops = markables.map((cell) =>
        buildOperation(cell, dir, DOT_PULL_REASON),
      );

      operations.push(...ops);
    }
  });

  return operations;
};

export default getAvailableOperations;
