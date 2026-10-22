import type { Board, Direction, Tile, Position } from "./types.js";

export interface MergeResult {
    tiles: Tile[];
    points: number;
    nextId: number;
}

export function mergeLine(tiles: Tile[], nextId: number): MergeResult {
    let points = 0;
    const mergedTiles: Tile[] = [];
    let currentTile: Tile | null = null;

    for (const tile of tiles) {
        if (currentTile === null) {
            currentTile = tile;
        } else if (currentTile.value === tile.value) {
            points += currentTile.value * 2;
            const newTile: Tile = {
                id: nextId++,
                value: currentTile.value * 2,
                row: currentTile.row,
                col: currentTile.col,
                merged: true,
                isNew: false
            };
            mergedTiles.push(newTile);
            currentTile = null;
        } else {
            mergedTiles.push({...currentTile, merged: false, isNew: false});
            currentTile = tile;
        }
    }

    if (currentTile !== null) {
        mergedTiles.push({...currentTile, merged: false, isNew: false});
    }

    return {
        tiles: mergedTiles,
        points,
        nextId
    };
}

export function move(board: Board, direction: Direction): Board {
    let nextId = board.nextId;
    const newTiles: Tile[] = [];
    let changed = false;
    const distance = (tile: Tile) => distanceFromWall(tile, direction, board.size);

    for (let i = 0; i < board.size; i++) {
        const lineTiles = board.tiles.filter(tile => lineOf(tile, direction) === i)
            .sort((a, b) => distance(a) - distance(b));
        const result = mergeLine(lineTiles, nextId);
        nextId = result.nextId;

        if (result.points > 0) {
            changed = true;
        }

        for (const [k, tile] of result.tiles.entries()) {
            const position = positionFor(direction, i, k, board.size);
            if (tile.row !== position.row || tile.col !== position.col) {
                changed = true;
            }
            newTiles.push({
                ...tile,
                row: position.row,
                col: position.col
            });
        }
    }

    if (!changed) {
        return board; // No change in the board
    }

    return {
        ...board,
        tiles: newTiles,
        nextId
    };
}

function lineOf(tile: Tile, direction: Direction): number {
    if (direction === 'up' || direction === 'down') {
        return tile.col;
    } else {
        return tile.row;
    }
}

function distanceFromWall(tile: Tile, direction: Direction, size: number): number {
    switch (direction) {
        case 'up':
            return tile.row;
        case 'down':
            return size - 1 - tile.row;
        case 'left':
            return tile.col;
        case 'right':
            return size - 1 - tile.col;
    }
}

function positionFor(direction: Direction, line: number, index: number, size: number): Position {
    switch (direction) {
        case 'up':
            return { row: index, col: line };
        case 'down':
            return { row: size - 1 - index, col: line };
        case 'left':
            return { row: line, col: index };
        case 'right':
            return { row: line, col: size - 1 - index };
    }
}