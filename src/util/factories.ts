import { Coordinates, DottedCell, MarkableCell, MarkerCell } from '../types';

export const markable = (coordinates: Coordinates): MarkableCell => ({
  type: 'markable',
  neighbors: {},
  coordinates,
});

export const dotted = (coordinates: Coordinates): DottedCell => ({
  ...markable(coordinates),
  dotted: true,
});

export const marker = (coordinates: Coordinates, size: number): MarkerCell => ({
  type: 'marker',
  neighbors: {},
  coordinates,
  size,
});
