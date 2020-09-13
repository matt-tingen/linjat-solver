import parse from '../parse';
import { MarkerCell } from '../types';
import canReach from './canReach';

describe('canReach', () => {
  it('returns true for adjacent cells', () => {
    const {
      dots: [dest],
      markers: [start],
    } = parse('*2');

    expect(canReach(start, dest)).toBe(true);
  });

  it('returns true for distant cells', () => {
    const {
      dots: [dest],
      markers: [start],
    } = parse('*.3');

    expect(canReach(start, dest)).toBe(true);
  });

  it('returns false for cells out of reach', () => {
    const {
      dots: [dest],
      markers: [start],
    } = parse('*.2');

    expect(canReach(start, dest)).toBe(false);
  });

  it('returns false for cells out of reach because of partial marking', () => {
    const {
      dots: [dest],
      markers: [start],
    } = parse('*.3>');

    expect(canReach(start, dest)).toBe(false);
  });

  it('returns false for cells out of reach because of complete marking', () => {
    const {
      dots: [dest],
      markers: [start],
    } = parse('.*3>>');

    expect(canReach(start, dest)).toBe(false);
  });

  it('returns false for marker destination', () => {
    const { getCell } = parse('*22.');

    const start = getCell({ x: 2, y: 0 }) as MarkerCell;
    const dest = getCell({ x: 1, y: 0 });

    expect(canReach(start, dest)).toBe(false);
  });

  it('returns false for blocked cells', () => {
    const { getCell } = parse('*22.');

    const start = getCell({ x: 2, y: 0 }) as MarkerCell;
    const dest = getCell({ x: 0, y: 0 });

    expect(canReach(start, dest)).toBe(false);
  });

  it('returns false for non-orthogonal cells', () => {
    const {
      dots: [dest],
      markers: [start],
    } = parse(`
    3..
    .*.
    ...
    `);

    expect(canReach(start, dest)).toBe(false);
  });
});
