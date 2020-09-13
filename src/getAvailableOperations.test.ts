import { DOT_PULL_REASON } from './constants';
import getAvailableOperations from './getAvailableOperations';
import parse from './parse';

describe('getAvailableOperations', () => {
  describe('dot pull ops', () => {
    it('finds an exact dot pull op', () => {
      const puzzle = parse('*2');
      const ops = getAvailableOperations(puzzle);

      expect(ops).toEqual([
        {
          coordinates: { x: 0, y: 0 },
          markFrom: 'right',
          reasons: [DOT_PULL_REASON],
        },
      ]);
    });

    it('finds an exact dot pull op which is partially marked', () => {
      const puzzle = parse('*<3');
      const ops = getAvailableOperations(puzzle);

      expect(ops).toEqual([
        {
          coordinates: { x: 0, y: 0 },
          markFrom: 'right',
          reasons: [DOT_PULL_REASON],
        },
      ]);
    });

    it('finds an exact extended dot pull op', () => {
      const puzzle = parse('3.*.');
      const ops = getAvailableOperations(puzzle);

      expect(ops).toIncludeSameMembers([
        {
          coordinates: { x: 1, y: 0 },
          markFrom: 'left',
          reasons: [DOT_PULL_REASON],
        },
        {
          coordinates: { x: 2, y: 0 },
          markFrom: 'left',
          reasons: [DOT_PULL_REASON],
        },
      ]);
    });

    it('finds an exact extended dot pull op which is partially marked', () => {
      const puzzle = parse('4>.*.');
      const ops = getAvailableOperations(puzzle);

      expect(ops).toIncludeSameMembers([
        {
          coordinates: { x: 2, y: 0 },
          markFrom: 'left',
          reasons: [DOT_PULL_REASON],
        },
        {
          coordinates: { x: 3, y: 0 },
          markFrom: 'left',
          reasons: [DOT_PULL_REASON],
        },
      ]);
    });

    it('finds an adjacent non-exact dot pull op', () => {
      const puzzle = parse(`...5*...`);
      const ops = getAvailableOperations(puzzle);

      expect(ops).toEqual([
        {
          coordinates: { x: 4, y: 0 },
          markFrom: 'left',
          reasons: [DOT_PULL_REASON],
        },
      ]);
    });

    it('finds no extended dot pull op when dot is accessible by multiple markers', () => {
      const puzzle = parse('3.*.3');
      const ops = getAvailableOperations(puzzle);

      expect(ops).toEqual([]);
    });

    // This would be helpful for having `solve` determine when a puzzle is invalid.
    it.skip('finds no extended dot pull op when there are invalid ambiguous dots', () => {
      const puzzle = parse('*2*');
      const ops = getAvailableOperations(puzzle);

      expect(ops).toEqual([]);
    });
  });
});
