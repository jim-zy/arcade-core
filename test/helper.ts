import type {Board} from '../src/2048/types.js';

export function makeBoard( grid: number[][]): Board {
    let currentId = 1;
    const tiles = grid.flatMap((row, rowIndex) =>
        row.flatMap((value, colIndex) => {
            if (value === 0) {
                return []; // Skip empty tiles
            }
            return [{
                id: currentId++,
                value,
                row: rowIndex,  
                col: colIndex,
                merged: false,
                isNew: false
            }];
        })
    );

    return {
        size: 4,
        tiles,
        nextId: currentId
    };
}

export function toGrid(board: Board): number[][] {
    const grid: number[][] = Array.from({ length: board.size }, () => Array(board.size).fill(0));

    for (const tile of board.tiles) {
        const gridRow = grid[tile.row];
        if (gridRow) {
            gridRow[tile.col] = tile.value;
        }
    }

    return grid;
}