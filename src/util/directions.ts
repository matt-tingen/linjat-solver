import { Direction } from '../types';

const opposites: Record<Direction, Direction> = {
  up: 'down',
  right: 'left',
  down: 'up',
  left: 'right',
};

export const opposite = (direction: Direction) => opposites[direction];

export const directions = Object.keys(opposites) as Direction[];
