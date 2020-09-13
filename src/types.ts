export type Direction = 'up' | 'right' | 'down' | 'left';

export type Neighbors = Partial<Record<Direction, Cell>>;

export interface BaseCell {
  type: string;
  neighbors: Neighbors;
  coordinates: Coordinates;
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

export interface Coordinates {
  x: number;
  y: number;
}

export interface Puzzle {
  markers: MarkerCell[];
  dots: DottedCell[];
  getCell(coordinates: Coordinates): Cell;
}

export type CellPredicate<T extends Cell | void = void> = T extends Cell
  ? (cell: Cell) => cell is T
  : (cell: Cell) => boolean;

export interface Operation {
  reasons: string[];
  coordinates: Coordinates;
  markFrom: Direction;
}
