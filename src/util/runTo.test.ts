import parse from '../parse';
import runTo from './runTo';
import { isMarked } from './typeGuards';

describe('runTo', () => {
  it('returns an empty run when next to the edge', () => {
    const {
      markers: [start],
    } = parse(`
    .3..
    ....
    `);
    const run = runTo(start, 'up');

    expect(run).toEqual([]);
  });

  it('returns connected cells between the start and edge', () => {
    const {
      markers: [start],
    } = parse(`
    .3..
    ....
    `);
    const run = runTo(start, 'right');

    expect(run).toEqual([
      start.neighbors.right,
      start.neighbors.right?.neighbors.right,
    ]);
  });

  it('returns connected cells matching a predicate', () => {
    const {
      markers: [start],
    } = parse(`
    3>>>..
    `);
    const run = runTo(start, 'right', isMarked);

    expect(run).toEqual([
      start.neighbors.right,
      start.neighbors.right?.neighbors.right,
      start.neighbors.right?.neighbors.right?.neighbors.right,
    ]);
  });
});
