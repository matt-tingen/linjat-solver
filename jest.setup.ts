import 'jest-extended';
import { partition } from 'lodash';
import { Neighbors } from './src/types';
import { directions, isCell } from './src/util';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toHaveNeighbors(neighbors: Neighbors): R;
    }
  }
}

expect.extend({
  toHaveNeighbors(cell: unknown, neighbors: Neighbors) {
    if (!isCell(cell)) {
      return {
        message: () => 'expected cell',
        pass: this.isNot,
      };
    }

    const [passes, fails] = partition(directions, (dir) =>
      Object.is(cell.neighbors[dir], neighbors[dir]),
    );

    const pass = fails.length === 0;

    if (pass) {
      return {
        message: () =>
          `the following neighbors are equal: ${passes.join(', ')}`,
        pass,
      };
    }

    return {
      message: () =>
        `the following neighbors were not equal: ${fails.join(', ')}`,
      pass,
    };
  },
});
