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
  puzzle.markers.forEach((marker) => {
    const couldBelongToMarker = (
      cell: Cell,
      markerDirection: Direction,
    ): cell is MarkableCell =>
      isMarkable(cell) &&
      (!cell.markedFrom || cell.markedFrom === markerDirection);

    const marks = getMarks(marker);

    const markableRuns = mapDirections((dir) =>
      runTo(
        marker,
        dir,
        (cell) => couldBelongToMarker(cell, flip(dir)),
        marker.size - 1,
      ),
    );

    const verticalSpace = sum(
      verticalDirections.map((dir) => markableRuns[dir].length),
    );
    const horizontalSpace = sum(
      horizontalDirections.map((dir) => markableRuns[dir].length),
    );

    const verticalSize = 1 + sum(verticalDirections.map((dir) => marks[dir]));
    const horizontalSize =
      1 + sum(horizontalDirections.map((dir) => marks[dir]));

    const canFitVertically =
      horizontalSize === 1 && verticalSize + verticalSpace >= marker.size;
    const canFitHorizontally =
      verticalSize === 1 && horizontalSize + horizontalSpace >= marker.size;

    if (canFitHorizontally !== canFitVertically) {
      const applicableDirections = canFitHorizontally
        ? horizontalDirections
        : verticalDirections;

      applicableDirections.forEach((dir: Direction) => {
        const markableRun = markableRuns[dir];
        const opposite = flip(dir);

        const minExtent = Math.min(
          markableRun.length,
          marker.size - markableRuns[opposite].length - 1,
        );

        const ops = markableRun
          .slice(0, minExtent)
          .filter(canBeMarked)
          .map((cell) => buildOperation(cell, opposite, EXPANSION_REASON));

        operations.push(...ops);
      });
    }
  });

  const coalesced = coalesceOperations(operations);

  return coalesced;
};

export default getAvailableOperations;
