import { groupBy, sum } from 'lodash';
import { DOT_PULL_REASON, EXPANSION_REASON } from './constants';
import {
  Cell,
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
  flip,
  horizontalDirections,
  isMarkable,
  isMarker,
  nearest,
  runTo,
  verticalDirections,
} from './util';
import getMarks from './util/getMarks';
import mapDirections from './util/mapDirections';

const buildOperation = (
  cell: MarkableCell,
  markFrom: Direction,
  reason: string,
): Operation => ({
  reasons: [reason],
  coordinates: cell.coordinates,
  markFrom,
});

const coalesceOperations = (operations: Operation[]) => {
  const groups = groupBy(
    operations,
    ({ coordinates: { x, y }, markFrom }) => `${x},${y};${markFrom}`,
  );

  return Object.values(groups).map(
    (ops): Operation => ({
      ...ops[0],
      reasons: ops.flatMap((op) => op.reasons),
    }),
  );
};

const isFullyMarked = (marker: MarkerCell) =>
  sum(Object.values(getMarks(marker))) === marker.size - 1;

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
      const markables = runTo(dot, dir, canBeMarked);

      if (canBeMarked(dot)) {
        markables.unshift(dot);
      }

      const ops = markables.map((cell) =>
        buildOperation(cell, dir, DOT_PULL_REASON),
      );

      operations.push(...ops);
    }
  });

  // expansion ops
  puzzle.markers
    .filter((marker) => !isFullyMarked(marker))
    .forEach((marker) => {
      const couldBelongToMarker = (
        cell: Cell,
        markerDirection: Direction,
      ): cell is MarkableCell =>
        isMarkable(cell) &&
        (!cell.markedFrom || cell.markedFrom === markerDirection);

      const spaceAvailable = mapDirections(
        (dir) =>
          runTo(
            marker,
            dir,
            (cell) => couldBelongToMarker(cell, flip(dir)),
            marker.size - 1,
          ).length,
      );
      const minExtents = mapDirections(
        (dir) => marker.size - spaceAvailable[flip(dir)] - 1,
      );

      const directionalOps = mapDirections((dir) => {
        const run = runTo(
          marker,
          dir,
          (cell) => couldBelongToMarker(cell, flip(dir)),
          minExtents[dir],
        );

        const opposite = flip(dir);
        const ops = run
          .filter(canBeMarked)
          .map((cell) => buildOperation(cell, opposite, EXPANSION_REASON));

        return ops;
      });

      const hasPerpendicularOps =
        horizontalDirections.some((hDir) => directionalOps[hDir].length) &&
        verticalDirections.some((vDir) => directionalOps[vDir].length);

      if (hasPerpendicularOps) return;

      const expansionOperations = Object.values(directionalOps).flat();

      operations.push(...expansionOperations);
    });

  const coalesced = coalesceOperations(operations);

  return coalesced;
};

export default getAvailableOperations;
