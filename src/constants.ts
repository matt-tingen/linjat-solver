import { invert } from 'lodash';
import { Direction } from './types';

export const DOT_CHAR = '*';
export const SPACE_CHAR = '.';

export const markCharMap: Record<Direction, string> = {
  up: 'v',
  right: '<',
  down: '^',
  left: '>',
};

export const markCharDirectionMap = invert(markCharMap) as Record<
  string,
  Direction
>;

export const DOT_PULL_REASON = 'pulled by dot';
