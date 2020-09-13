import stringify from './stringify';
import { Puzzle } from './types';

class PuzzleError extends Error {
  constructor(puzzle: Puzzle, message: string) {
    super([message, '', 'Puzzle:', stringify(puzzle), ''].join('\n'));
    this.name = this.constructor.name;
  }
}

export default PuzzleError;
