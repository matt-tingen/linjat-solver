import parse from '../parse';
import nearest from './nearest';
import { isMarked } from './typeGuards';

describe('nearest', () => {
  it('returns undefined when next to the edge', () => {
    const {
      markers: [start],
    } = parse(`
    .3..
    ....
    `);
    const found = nearest(start, 'up', () => true);

    expect(found).toBeUndefined();
  });

  it('returns undefined when there is no cell matching the predicate', () => {
    const {
      markers: [start],
    } = parse(`
    .3..
    ....
    `);
    const found = nearest(start, 'right', () => false);

    expect(found).toBeUndefined();
  });

  it('returns adjacent matching cell', () => {
    const {
      markers: [start],
    } = parse(`
    3>>>..
    `);
    const found = nearest(start, 'right', isMarked);

    expect(found === start.neighbors.right).toBe(true);
  });

  it('returns distant matching cell', () => {
    const {
      markers: [start, b],
    } = parse(`
    3..<2
    `);
    const found = nearest(start, 'right', isMarked);

    expect(found).toBe(b.neighbors.left);
  });
});
