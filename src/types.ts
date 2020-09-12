export type Direction = 'up' | 'right' | 'down' | 'left';

export type Neighbors = Partial<Record<Direction, Cell>>;

export interface BaseCell {
  type: string;
  neighbors: Neighbors;
}

export interface MarkerCell extends BaseCell {
  type: 'marker';
  size: number;
}

export interface MarkableCell extends BaseCell {
  type: 'markable';
  markedFrom?: Direction;
  dotted?: boolean;
}

export interface MarkedCell extends MarkableCell {
  markedFrom: Direction;
}

export interface DottedCell extends MarkableCell {
  dotted: true;
}

export type Cell = MarkerCell | MarkableCell;

export interface Puzzle {
  markers: MarkerCell[];
  dots: DottedCell[];
  getCell(x: number, y: number): Cell;
}
