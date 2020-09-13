import parse from '../parse';
import { MarkerCell } from '../types';
import getMaxExtent from './getMaxExtent';

describe('getMaxExtent', () => {
  it('determines max extent when extending to wall', () => {
    const {
      markers: [marker],
    } = parse('2.');

    expect(getMaxExtent(marker, 'right')).toBe(1);
  });

  it('allows no extension against wall', () => {
    const {
      markers: [marker],
    } = parse('2.');

    expect(getMaxExtent(marker, 'left')).toBe(0);
  });

  it('limits max extent based on size', () => {
    const {
      markers: [marker],
    } = parse('3....');

    expect(getMaxExtent(marker, 'right')).toBe(2);
  });

  it('includes existing marks in max extent', () => {
    const {
      markers: [marker],
    } = parse('3>>');

    expect(getMaxExtent(marker, 'right')).toBe(2);
  });

  it('limits max extent when running into unrelated marks', () => {
    const { getCell } = parse('..3.2');
    const marker = getCell({ x: 2, y: 0 }) as MarkerCell;

    expect(getMaxExtent(marker, 'right')).toBe(1);
  });

  it('limits max extent when running into other markers', () => {
    const {
      markers: [marker],
    } = parse('..32.');

    expect(getMaxExtent(marker, 'right')).toBe(0);
  });
});
