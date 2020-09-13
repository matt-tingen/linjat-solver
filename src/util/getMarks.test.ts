import parse from '../parse';
import { MarkerCell } from '../types';
import getMarks from './getMarks';

describe('getMarks', () => {
  it('finds no marks when there are none', () => {
    const {
      markers: [marker],
    } = parse(`
    ...
    .2.
    ...
    `);

    expect(getMarks(marker)).toEqual({
      up: 0,
      right: 0,
      down: 0,
      left: 0,
    });
  });

  it('finds no marks when against a wall', () => {
    const {
      markers: [marker],
    } = parse('2');

    expect(getMarks(marker)).toEqual({
      up: 0,
      right: 0,
      down: 0,
      left: 0,
    });
  });

  it('finds a single mark', () => {
    const {
      markers: [marker],
    } = parse('.2>');

    expect(getMarks(marker)).toEqual({
      up: 0,
      right: 1,
      down: 0,
      left: 0,
    });
  });
  it('finds a run of marks', () => {
    const {
      markers: [marker],
    } = parse('.4>>>');

    expect(getMarks(marker)).toEqual({
      up: 0,
      right: 3,
      down: 0,
      left: 0,
    });
  });

  it('ignores marks belonging to other markers', () => {
    const { getCell } = parse('.2<2');
    const marker = getCell({ x: 1, y: 0 }) as MarkerCell;

    expect(getMarks(marker)).toEqual({
      up: 0,
      right: 0,
      down: 0,
      left: 0,
    });
  });
});
