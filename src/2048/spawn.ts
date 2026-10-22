import type { Board, Tile, Position } from './types.js';

export function spawn(board: Board, rng: () => number = Math.random): Board {
    const empty = emptyCells(board);

    const emptyCell = empty[Math.floor(rng() * empty.length)];
    if (!emptyCell) {
        return board; // No empty cells, return the board unchanged
    }
    const {row, col} = emptyCell;
    const newTile: Tile = {
        id: board.nextId,
        value: rng() < 0.9 ? 2 : 4,
        row: row,
        col: col,
        merged: false,
        isNew: true
    };

    return {
        ...board,
        tiles: [...board.tiles, newTile],
        nextId: board.nextId + 1
    };
}

function emptyCells(board: Board): Position[] {
    const empty: Position[] = [];
    for (let row = 0; row < board.size; row++) {
        for (let col = 0; col < board.size; col++) {
            if (!board.tiles.some(tile => tile.row === row && tile.col === col)) {
                empty.push({ row, col });
            }
        }
    }
    return empty;
}