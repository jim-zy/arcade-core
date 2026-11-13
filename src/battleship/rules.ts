import { BOARD_SIZE } from "./constants.js";
import type { BattleshipBoard, Shot, Ship } from "./types.js";

export function isValidShot(board: BattleshipBoard, x: number, y: number): boolean {
    if (!isWithinBoard(x) || !isWithinBoard(y)) return false;

    if (board.shots.some((shot) => shot.x === x && shot.y === y)) return false;

    return true;

}

export function isShipSunk(ship: Ship, shots: Shot[]): boolean {
    return ship.cells.every((cell) => shots.some((shot) => shot.x === cell.x && shot.y === cell.y));
}

export function getSunkShips(board: BattleshipBoard): Ship[] {
    return board.ships.filter((ship) => isShipSunk(ship, board.shots));
}

// never call it on the opponent’s trimmed view (call on your own board)
export function isGameComplete(board: BattleshipBoard): boolean {
    return board.ships.every((ship) => isShipSunk(ship, board.shots));
}

function isWithinBoard(num: number): boolean {
    return Number.isInteger(num) && num >= 0 && num < BOARD_SIZE;
}