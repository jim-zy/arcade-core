export type Direction = 'up' | 'down' | 'left' | 'right';

export interface Tile {
	id: number;
	value: number;
	row: number;
	col: number;
	merged: boolean;
	isNew: boolean;
}

export interface Board {
	size: 4;
	tiles: Tile[];
	nextId: number;
}

