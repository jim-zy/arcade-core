import { describe, it, expect} from "vitest";
import { makeBoard } from "./helper.js";
import type { ShipName } from "../../src/battleship/types.js";
import { isShipSunk, isValidShot, getSunkShips, isGameComplete } from "../../src/battleship/rules.js";

describe('isValidShot', () => {
    it('Empty Board allows valid corners', () => {
        const board = makeBoard();
        expect((isValidShot(board, 0, 0))).toBe(true);
        expect((isValidShot(board, 9, 9))).toBe(true);
        expect(isValidShot(board, 10, 0)).toBe(false);
        expect(isValidShot(board, 0, 10)).toBe(false);
        expect(isValidShot(board, -1, 5)).toBe(false);
        expect(isValidShot(board, 2.5, 3)).toBe(false);
        expect(isValidShot(board, NaN, 0)).toBe(false);
    });

    it('Double shot is a miss', () => {
        const missBoard = makeBoard([{ x: 3, y: 5, hit: false}]);
        const hitBoard = makeBoard([{ x: 3, y: 5, hit: true}]);

        expect(isValidShot(missBoard, 3, 5)).toBe(false);
        expect(isValidShot(hitBoard, 3, 5)).toBe(false);
        expect(isValidShot(hitBoard, 5, 3)).toBe(true);
        expect(isValidShot(hitBoard, 3, 6)).toBe(true);        
    });

    it('Board only with ships allows shots', () => {
        const board = makeBoard([], [{ name: 'destroyer', cells: [{ x: 0, y: 0}, { x: 1, y: 0 }] }]);
        expect(isValidShot(board, 0, 0)).toBe(true);
        expect(isValidShot(board, 9, 9)).toBe(true);
    })
});

describe('isShipSunk', () => {
    it('Ship is sunk when all cells are hit', () => {
        const ship = { name: 'destroyer' as ShipName, cells: [{ x: 0, y: 0}, { x: 1, y: 0 }] };
        const shots = [{ x: 0, y: 0, hit: true }, { x: 1, y: 0, hit: true }];
        expect(isShipSunk(ship, shots)).toBe(true);
    });

    it('Ship is not sunk when not all cells are hit', () => {
        const ship = { name: 'destroyer' as ShipName, cells: [{ x: 0, y: 0}, { x: 1, y: 0 }] };
        const shots = [{ x: 0, y: 0, hit: true }];
        expect(isShipSunk(ship, shots)).toBe(false);
    });
});

describe('getSunkShips', () => {
    it('Returns all sunk ships', () => {
        const board = makeBoard(
            [{ x: 0, y: 0, hit: true }, { x: 1, y: 0, hit: true }, { x: 2, y: 0, hit: false }],
            [
                { name: 'destroyer' as ShipName, cells: [{ x: 0, y: 0}, { x: 1, y: 0 }] },
                { name: 'submarine' as ShipName, cells: [{ x: 2, y: 0}, { x: 3, y: 0 }] }
            ]
        );
        const sunkShips = getSunkShips(board);
        expect(sunkShips.length).toBe(1);
        expect(sunkShips[0].name).toBe('destroyer');
    });
});

describe('isGameComplete', () => {
    it('Returns true when all ships are sunk', () => {
        const board = makeBoard(
            [{ x: 0, y: 0, hit: true }, { x: 1, y: 0, hit: true }],
            [
                { name: 'destroyer' as ShipName, cells: [{ x: 0, y: 0}, { x: 1, y: 0 }] }
            ]
        );
        expect(isGameComplete(board)).toBe(true);
    });

    it('Returns false when not all ships are sunk', () => {
        const board = makeBoard(
            [{ x: 0, y: 0, hit: true }, { x: 2, y: 0, hit: false }],
            [
                { name: 'destroyer' as ShipName, cells: [{ x: 0, y: 0}, { x: 1, y: 0 }] }
            ]
        );
        expect(isGameComplete(board)).toBe(false);
    });
});