import { DottedCell, MarkableCell, MarkerCell } from '../types';

export const markable = (): MarkableCell => ({
  type: 'markable',
  neighbors: {},
});

export const dotted = (): DottedCell => ({
  ...markable(),
  dotted: true,
});

export const marker = (size: number): MarkerCell => ({
  type: 'marker',
  neighbors: {},
  size,
});
