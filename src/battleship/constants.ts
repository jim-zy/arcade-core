import type { ShipName } from "./types.js";

export const BOARD_SIZE = 10;

export const FLEET: Record<ShipName, number> = {
    carrier: 5,
    battleship: 4,
    cruiser: 3,
    submarine: 3,
    destroyer: 2
}