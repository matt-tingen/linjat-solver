import parse from './parse';
import {
  Cell,
  Coordinates,
  DottedCell,
  MarkableCell,
  MarkerCell,
  Puzzle,
} from './types';
import { dotted, markable, marker } from './util';

describe('parse', () => {
  let puzzle: Puzzle;

  describe('trivial puzzle', () => {
    beforeAll(() => {
      puzzle = parse('.');
    });

    it('has no significant cells', () => {
      expect(puzzle.dots).toEqual([]);
      expect(puzzle.markers).toEqual([]);
    });

    it('retrieves the cell', () => {
      expect(puzzle.getCell({ x: 0, y: 0 })).toEqual(markable());
    });

    it('retrieves the coordinates', () => {
      const coords = { x: 0, y: 0 };
      const cell = puzzle.getCell(coords);

      expect(puzzle.getCoords(cell)).toEqual(coords);
    });
  });

  describe('basic cells', () => {
    let a: DottedCell;
    let b: Cell;
    let c: MarkerCell;

    beforeAll(() => {
      puzzle = parse('*.3');
      [a] = puzzle.dots;
      [c] = puzzle.markers;

      b = a.neighbors.right!;
    });

    it('has a dot', () => {
      expect(puzzle.dots).toHaveLength(1);
      expect(a).toMatchObject(dotted());
    });

    it('has a marker', () => {
      expect(puzzle.markers).toHaveLength(1);
      expect(c).toMatchObject(marker(3));
    });

    it('has a markable cell', () => {
      expect(b).toMatchObject(markable());
    });

    it('relates cells', () => {
      expect(a).toHaveNeighbors({ right: b });
      expect(b).toHaveNeighbors({ left: a, right: c });
      expect(c).toHaveNeighbors({ left: b });
    });

    it('retrieves cells', () => {
      expect(puzzle.getCell({ x: 0, y: 0 })).toBe(a);
      expect(puzzle.getCell({ x: 1, y: 0 })).toBe(b);
      expect(puzzle.getCell({ x: 2, y: 0 })).toBe(c);
    });

    it('retrieves coordinates', () => {
      const testCases: [Cell, Coordinates][] = [
        [a, { x: 0, y: 0 }],
        [b, { x: 1, y: 0 }],
        [c, { x: 2, y: 0 }],
      ];

      testCases.forEach(([cell, coords]) => {
        expect(puzzle.getCoords(cell)).toEqual(coords);
      });
    });
  });

  describe('multiline', () => {
    let a: DottedCell;
    let b: Cell;
    let c: MarkerCell;
    let d: Cell;
    let e: MarkerCell;
    let f: DottedCell;

    beforeAll(() => {
      puzzle = parse(`
      *.3
      .2*
      `);

      [a, f] = puzzle.dots;
      [c, e] = puzzle.markers;
      b = a.neighbors.right!;
      d = a.neighbors.down!;
    });

    it('has 2 dots', () => {
      expect(puzzle.dots).toHaveLength(2);
      expect(a).toMatchObject(dotted());
      expect(f).toMatchObject(dotted());
    });

    it('has 2 markers', () => {
      expect(puzzle.markers).toHaveLength(2);
      expect(c).toMatchObject(marker(3));
      expect(e).toMatchObject(marker(2));
    });

    it('has 2 markable cells', () => {
      expect(b).toMatchObject(markable());
      expect(d).toMatchObject(markable());
    });

    it('relates cells', () => {
      expect(a).toHaveNeighbors({ right: b, down: d });
      expect(b).toHaveNeighbors({ left: a, right: c, down: e });
      expect(c).toHaveNeighbors({ left: b, down: f });
      expect(d).toHaveNeighbors({ up: a, right: e });
      expect(e).toHaveNeighbors({ left: d, right: f, up: b });
      expect(f).toHaveNeighbors({ left: e, up: c });
    });

    it('retrieves cells', () => {
      expect(puzzle.getCell({ x: 0, y: 0 })).toBe(a);
      expect(puzzle.getCell({ x: 1, y: 0 })).toBe(b);
      expect(puzzle.getCell({ x: 2, y: 0 })).toBe(c);
      expect(puzzle.getCell({ x: 0, y: 1 })).toBe(d);
      expect(puzzle.getCell({ x: 1, y: 1 })).toBe(e);
      expect(puzzle.getCell({ x: 2, y: 1 })).toBe(f);
    });

    it('retrieves coordinates', () => {
      const testCases: [Cell, Coordinates][] = [
        [a, { x: 0, y: 0 }],
        [b, { x: 1, y: 0 }],
        [c, { x: 2, y: 0 }],
        [d, { x: 0, y: 1 }],
        [e, { x: 1, y: 1 }],
        [f, { x: 2, y: 1 }],
      ];

      testCases.forEach(([cell, coords]) => {
        expect(puzzle.getCoords(cell)).toEqual(coords);
      });
    });
  });

  describe('marked cells', () => {
    let a: Cell;
    let b: Cell;
    let c: Cell;
    let d: Cell;

    beforeAll(() => {
      puzzle = parse(`
      <2.2>
      2...^
      v...2
      `);
      [a, b, c, d] = puzzle.markers;
      a = a.neighbors.left!;
      b = b.neighbors.right!;
      c = c.neighbors.down!;
      d = d.neighbors.up!;
    });

    it('marks from right', () => {
      expect(a).toMatchObject(markable());
      expect((a as MarkableCell).markedFrom).toBe('right');
    });
    it('marks from left', () => {
      expect(b).toMatchObject(markable());
      expect((b as MarkableCell).markedFrom).toBe('left');
    });
    it('marks from up', () => {
      expect(c).toMatchObject(markable());
      expect((c as MarkableCell).markedFrom).toBe('up');
    });
    it('marks from down', () => {
      expect(d).toMatchObject(markable());
      expect((d as MarkableCell).markedFrom).toBe('down');
    });
  });
});
