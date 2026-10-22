import type { Board, Direction, Tile, Position } from "./types.js";
import { move } from "./move.js";

export function score(board: Board): number {
    return board.tiles.reduce((sum, tile) => sum + (tile.merged ? tile.value : 0), 0);
}

export function hasMoves(board: Board): boolean {
    for (const direction of ['up', 'down', 'left', 'right'] as Direction[]) {
        if (move(board, direction) !== board) {
            return true;
        }
    }
    return false;
}
