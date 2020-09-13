import { Direction } from '../types';

const opposites: Record<Direction, Direction> = {
  up: 'down',
  right: 'left',
  down: 'up',
  left: 'right',
};

export const flip = (direction: Direction) => opposites[direction];

export const directions = Object.keys(opposites) as Direction[];

const verticalDirections: [Direction, Direction] = ['up', 'down'];
const horizontalDirections: [Direction, Direction] = ['left', 'right'];

export const getPerpendicularDirections = (direction: Direction) =>
  verticalDirections.includes(direction)
    ? horizontalDirections
    : verticalDirections;
