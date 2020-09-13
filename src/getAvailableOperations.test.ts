import { DOT_PULL_REASON, EXPANSION_REASON } from './constants';
import getAvailableOperations from './getAvailableOperations';
import parse from './parse';

describe('getAvailableOperations', () => {
  describe('dot pull ops', () => {
    it('finds an exact dot pull op', () => {
      const puzzle = parse('*2.');
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
      const puzzle = parse('*<3..');
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
      const puzzle = parse('..3.*.');
      const ops = getAvailableOperations(puzzle);

      expect(ops).toIncludeSameMembers([
        {
          coordinates: { x: 3, y: 0 },
          markFrom: 'left',
          reasons: [DOT_PULL_REASON],
        },
        {
          coordinates: { x: 4, y: 0 },
          markFrom: 'left',
          reasons: [DOT_PULL_REASON],
        },
      ]);
    });

    it('finds an exact extended dot pull op which is partially marked', () => {
      const puzzle = parse('...4>.*.');
      const ops = getAvailableOperations(puzzle);

      expect(ops).toIncludeSameMembers([
        {
          coordinates: { x: 5, y: 0 },
          markFrom: 'left',
          reasons: [DOT_PULL_REASON],
        },
        {
          coordinates: { x: 6, y: 0 },
          markFrom: 'left',
          reasons: [DOT_PULL_REASON],
        },
      ]);
    });

    it('finds an adjacent non-exact dot pull op', () => {
      const puzzle = parse(`.....5*.....`);
      const ops = getAvailableOperations(puzzle);

      expect(ops).toEqual([
        {
          coordinates: { x: 6, y: 0 },
          markFrom: 'left',
          reasons: [DOT_PULL_REASON],
        },
      ]);
    });

    it('finds no extended dot pull op when dot is accessible by multiple markers', () => {
      const puzzle = parse('..3.*.3..');
      const ops = getAvailableOperations(puzzle);

      expect(ops).toEqual([]);
    });

    it('finds no dot pull op when corresponding marker is complete', () => {
      const puzzle = parse('*<<4');

      puzzle.dots[0].markedFrom = 'right';

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

  describe('expansion ops', () => {
    it('finds an exact expansion op', () => {
      const puzzle = parse('.2');
      const ops = getAvailableOperations(puzzle);

      expect(ops).toEqual([
        {
          coordinates: { x: 0, y: 0 },
          markFrom: 'right',
          reasons: [EXPANSION_REASON],
        },
      ]);
    });

    it('finds an exact expansion op which is partially marked', () => {
      const puzzle = parse('.<3');
      const ops = getAvailableOperations(puzzle);

      expect(ops).toEqual([
        {
          coordinates: { x: 0, y: 0 },
          markFrom: 'right',
          reasons: [EXPANSION_REASON],
        },
      ]);
    });

    it('finds a complete unidirectional extended expansion op', () => {
      const puzzle = parse('3....');
      const ops = getAvailableOperations(puzzle);

      expect(ops).toIncludeSameMembers([
        {
          coordinates: { x: 1, y: 0 },
          markFrom: 'left',
          reasons: [EXPANSION_REASON],
        },
        {
          coordinates: { x: 2, y: 0 },
          markFrom: 'left',
          reasons: [EXPANSION_REASON],
        },
      ]);
    });

    it('finds an incomplete unidirectional extended expansion op', () => {
      const puzzle = parse('.3..');
      const ops = getAvailableOperations(puzzle);

      expect(ops).toEqual([
        {
          coordinates: { x: 2, y: 0 },
          markFrom: 'left',
          reasons: [EXPANSION_REASON],
        },
      ]);
    });

    it('finds an incomplete bidirectional extended expansion op', () => {
      const puzzle = parse('..5...');
      const ops = getAvailableOperations(puzzle);

      expect(ops).toIncludeSameMembers([
        {
          coordinates: { x: 1, y: 0 },
          markFrom: 'right',
          reasons: [EXPANSION_REASON],
        },
        {
          coordinates: { x: 3, y: 0 },
          markFrom: 'left',
          reasons: [EXPANSION_REASON],
        },
        {
          coordinates: { x: 4, y: 0 },
          markFrom: 'left',
          reasons: [EXPANSION_REASON],
        },
      ]);
    });

    it('finds an incomplete bidirectional extended partially-marked expansion op', () => {
      const puzzle = parse('..5>..');
      const ops = getAvailableOperations(puzzle);

      expect(ops).toIncludeSameMembers([
        {
          coordinates: { x: 1, y: 0 },
          markFrom: 'right',
          reasons: [EXPANSION_REASON],
        },
        {
          coordinates: { x: 4, y: 0 },
          markFrom: 'left',
          reasons: [EXPANSION_REASON],
        },
      ]);
    });

    it('finds no expansion op when unconstrained', () => {
      const puzzle = parse('..3..');
      const ops = getAvailableOperations(puzzle);

      expect(ops).toEqual([]);
    });

    it('finds a complete unidirection expansion op which is reachable by another marker', () => {
      const puzzle = parse('.2.2');
      const ops = getAvailableOperations(puzzle);

      expect(ops).toEqual([
        {
          coordinates: { x: 2, y: 0 },
          markFrom: 'right',
          reasons: [EXPANSION_REASON],
        },
      ]);
    });

    it('finds a complete unidirection expansion op which is forced by an unrelated mark', () => {
      const puzzle = parse('.2<2');
      const ops = getAvailableOperations(puzzle);

      expect(ops).toEqual([
        {
          coordinates: { x: 0, y: 0 },
          markFrom: 'right',
          reasons: [EXPANSION_REASON],
        },
      ]);
    });

    it('finds no expansion op when marker can expand in either orientation', () => {
      const puzzle = parse(`
      2.
      ..
      `);
      const ops = getAvailableOperations(puzzle);

      expect(ops).toEqual([]);
    });

    it('finds no expansion when marker is complete', () => {
      const puzzle = parse('<<<4');
      const ops = getAvailableOperations(puzzle);

      expect(ops).toEqual([]);
    });

    it('finds no perpendicular expansion when marker is complete', () => {
      const puzzle = parse(`
      ...
      <<3
      ...
      `);
      const ops = getAvailableOperations(puzzle);

      expect(ops).toEqual([]);
    });

    it('finds expansion when orientation is disambiguated by perpendicular mark', () => {
      const puzzle = parse(`
      .3.
      <<3
      ...
      `);
      const ops = getAvailableOperations(puzzle);

      expect(ops).toIncludeSameMembers([
        {
          coordinates: { x: 0, y: 0 },
          markFrom: 'right',
          reasons: [EXPANSION_REASON],
        },
        {
          coordinates: { x: 2, y: 0 },
          markFrom: 'left',
          reasons: [EXPANSION_REASON],
        },
      ]);
    });
  });

  describe('multi-reason', () => {
    it('finds an operation with multiple reasons', () => {
      const puzzle = parse('*2');
      const ops = getAvailableOperations(puzzle);

      expect(ops).toEqual([
        {
          coordinates: { x: 0, y: 0 },
          markFrom: 'right',
          reasons: expect.arrayContaining([DOT_PULL_REASON, EXPANSION_REASON]),
        },
      ]);
    });
  });
});
