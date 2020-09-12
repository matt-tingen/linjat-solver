import { Direction } from './types';

export const DOT_CHAR = '*';
export const SPACE_CHAR = '.';

export const TERMINAL_CHARS: Record<Direction, string> = {
  up: 'v',
  right: '<',
  down: '^',
  left: '>',
};

export const CONNECTING_CHARS: Record<Direction, string> = {
  up: '|',
  right: '-',
  down: '|',
  left: '-',
};
