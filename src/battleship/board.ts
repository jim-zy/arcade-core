import type { BattleshipBoard, Coordinate, Ship, ShipName } from "./types.js";
import { FLEET, BOARD_SIZE } from "./constants.js";
import { isValidShot } from "./rules.js";

const RETRY_LIMIT = 100;

export function updateBoard(board: BattleshipBoard, x: number, y: number): BattleshipBoard {
    if (!isValidShot(board, x, y)) throw new Error(`Invalid Shot at (${x}, ${y})`);

    const hit = board.ships.some(ship => ship.cells.some(cell => cell.x === x && cell.y === y));

    return {
        ...board,
        shots: [...board.shots, {
            x,
            y,
            hit
        }]
    };
};

export function createRandomBoard(random = Math.random): BattleshipBoard {
    const ships: Ship[] = [];
    const occupiedCells = new Set<string>();
    
    for (const [shipName, shipSize] of Object.entries(FLEET)) {
        let cells: Coordinate[] = [];
        let retryCount = 0;
        
        while (retryCount < RETRY_LIMIT) {
            cells = pickRandomStartToGenerateCells(shipSize, random);
            if (cells.every(cell => !occupiedCells.has(key(cell)))) {
                break;
            }
            retryCount++;
        }

        if (retryCount === RETRY_LIMIT) {
            throw new Error(`Failed to place ship: ${shipName}`);
        }

        cells.forEach(cell => occupiedCells.add(key(cell)));
        ships.push({ name: shipName as ShipName, cells });
    }

    return {
        ships,
        shots: []
    };
}

function pickRandomStartToGenerateCells(shipSize: number, random: () => number): Coordinate[] {
    const horizontal = random() < 0.5;
    if (horizontal) {
        const x = Math.floor(random() * (BOARD_SIZE - shipSize + 1));
        const y = Math.floor(random() * BOARD_SIZE);
        return Array.from({ length: shipSize }, (_, i) => ({ x: x + i, y }));
    } else {
        const x = Math.floor(random() * BOARD_SIZE);
        const y = Math.floor(random() * (BOARD_SIZE - shipSize + 1));
        return Array.from({ length: shipSize }, (_, i) => ({ x, y: y + i }));
    }
}

function key(c: Coordinate): string {
    return `${c.x},${c.y}`;
}

