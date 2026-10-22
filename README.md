# @peacestay/arcade-core

Arcade core package for 2048 game logics, for Student Zhiyuan Zhao in CS5610 course

## Install

```bash
npm install @peacestay/arcade-core
```

## Development
```bash
npm install
npm run build && npm test
npm publish --access public
```

## Get started

```ts
import { createBoard, spawn, move, score, hasMoves } from '@peacestay/arcade-core';
const board = createBoard();
const firstSpawn = spawn(board);
const secondSpawn = spawn(firstSpawn);
const movedBoard = move(secondSpawn, 'left') // movedBoard is the same if no moved nor merged
```

create a board with no tiles -> spawn twice to get started
choose a direction to move -> check if the board changed, either merged or moved
if changed -> add the score() is merged -> spawn again
if not changed -> not a valid move, return the same board
if hasMoves() is false -> game ends

## API

### `createBoard(): Board`
create a Board object with empty cells

### `move(board, direction): Board`
move a board given the direction, merge or just move the cells if possible, return the same board if neither

### `spawn(board, rng?): Board`
spawn a cell with value 2 or 4, rng is optional, math.random by default
call rng first to pick a cell, and call it again for 2 or 4 (<0.9 -> 2, else 4)

### `score(board): number`
points earned by the move 

### `hasMoves(board): boolean`
use move in four directions too see if any move is possible

## Key Types

### Board

Represents a board with size=4 by default, a list of Tiles and the id number of next cell
id starts at 1 incremented whenever there's a new tile spawned or a valid merge.

```ts
export interface Board {
	size: 4;
	tiles: Tile[];
	nextId: number;
}
```

### Tile

Represents a cell with a value
id is number passed from the nextId in the board, row, col are the coords
merged is only true when a new tile generated from a merge
isNew is ture only when the tile was first added by a spawn (merged tile also has false flag)

```ts
export interface Tile {
	id: number;
	value: number;
	row: number;
	col: number;
	merged: boolean;
	isNew: boolean;
}
```


