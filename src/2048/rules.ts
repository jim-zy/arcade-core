import type { Board, Direction } from "./types.js";
import { move } from "./move.js";

export function score(board: Board): number {
    return board.tiles.reduce((sum, tile) => sum + (tile.merged ? tile.value : 0), 0);
}

export function hasMoves(board: Board): boolean {
    for (const direction of ['up', 'down', 'left', 'right'] as Direction[]) {
        if (canMove(board, direction)) return true;
    }
    return false;
}

export function canMove(board: Board, direction: Direction): boolean {
    return move(board, direction) !== board;
}
