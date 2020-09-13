import { Direction } from '../types';
import { directions } from './directions';

const mapDirections = <T>(iteree: (direction: Direction) => T) =>
  Object.fromEntries(directions.map((dir) => [dir, iteree(dir)])) as Record<
    Direction,
    T
  >;

export default mapDirections;
