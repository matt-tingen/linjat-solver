import parse from './parse';
import solve from './solve';
import stringify from './stringify';
import trim from './trimPuzzleString';

describe('solve', () => {
  it('solves a single operation puzzle', () => {
    const puzzle = parse('2*');
    const solved = solve(puzzle);

    expect(stringify(solved)).toBe(trim('2>'));
  });

  it('solves a single step puzzle', () => {
    const puzzle = parse('4..*');
    const solved = solve(puzzle);

    expect(stringify(solved)).toBe(trim('4>>>'));
  });

  it('solves a two step puzzle', () => {
    const puzzle = parse(`
    .3.
    *.3
    ...
    `);
    const solved = solve(puzzle);

    expect(stringify(solved)).toBe(
      trim(`
    <3>
    <<3
    ...
    `),
    );
  });

  it('solves easy puzzle 1', () => {
    const puzzle = parse(`
    .........
    4..*.....
    ...*.....
    **.3...*3
    22.......
    **.5.**3*
    `);
    const solved = solve(puzzle);

    expect(stringify(solved)).toBe(
      trim(`
      ^........
      4..^.....
      v..^.....
      v^.3..<<3
      22.......
      v<<5>><3>
    `),
    );
  });
});
