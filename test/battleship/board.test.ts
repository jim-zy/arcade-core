import { describe, it, expect } from "vitest";
import { makeBoard, fakeRandomGenerator } from "./helper.js";
import { updateBoard, createRandomBoard } from "../../src/battleship/board.js";
import { FLEET } from "../../src/battleship/constants.js";

describe('updateBoard', () => {
    it('should add a shot to the board', () => {
        const board = makeBoard();
        const firedBoard = updateBoard(board, 0, 0);
        expect(firedBoard.shots.at(-1)).toEqual({ x: 0, y: 0, hit: false });
    })

    it ('firing at a ship should register a hit', () => {
        const board = makeBoard([], [{ name: 'destroyer', cells: [{ x: 0, y: 0}, { x: 1, y: 0 }] }]);
        const firedBoard = updateBoard(board, 0, 0);
        expect(firedBoard.shots.at(-1)).toEqual({ x: 0, y: 0, hit: true });
    })

    it ('fire twice at different squares should register both shots', () => {
        const board = makeBoard([], [{ name: 'destroyer', cells: [{ x: 0, y: 0}, { x: 1, y: 0 }] }]);
        const firedBoard = updateBoard(board, 0, 0);
        const firedBoard2 = updateBoard(firedBoard, 5, 5);
        expect(firedBoard2.shots).toEqual([
            { x: 0, y: 0, hit: true },
            { x: 5, y: 5, hit: false }
        ]);
    })

    it ('input is unchanged and a new board is returned', () => {
        const board = makeBoard([], [{ name: 'destroyer', cells: [{ x: 0, y: 0}, { x: 1, y: 0 }] }]);
        const firedBoard = updateBoard(board, 0, 0);
        expect(firedBoard).not.toBe(board);
        expect(board.shots).toEqual([]);
    })

    it ('repeat or off the board shots should throw an error', () => {
        const board = makeBoard([], [{ name: 'destroyer', cells: [{ x: 0, y: 0}, { x: 1, y: 0 }] }]);
        const firedBoard = updateBoard(board, 0, 0);
        expect(() => updateBoard(firedBoard, 0, 0)).toThrow(/\(0, 0\)/);
        expect(() => updateBoard(firedBoard, -1, 0)).toThrow(/\(-1, 0\)/);
        expect(() => updateBoard(firedBoard, 10, 10)).toThrow(/\(10, 10\)/);
    })
});

describe('createRandomBoard', () => {
    it('should create a board with the correct number of ships', () => {
        const board = createRandomBoard();
        expect(board.ships.length).toBe(Object.keys(FLEET).length);
        expect(board.ships.map(ship => ship.name).sort()).toEqual(Object.keys(FLEET).sort());
        expect(board.ships.map(ship => ship.cells.length).sort()).toEqual(Object.values(FLEET).sort());
    });
    
    it('should create a board with no overlapping or broken ships', () => {
        const board = createRandomBoard();
        const occupiedCells = new Set<string>();
        for (const ship of board.ships) {
            for (const cell of ship.cells) {
                const key = `${cell.x},${cell.y}`;
                expect(occupiedCells.has(key)).toBe(false);
                occupiedCells.add(key);
            }
        };
        for (const ship of board.ships) {
            const xs = ship.cells.map(cell => cell.x);
            const ys = ship.cells.map(cell => cell.y);
            const isHorizontal = xs.every(x => x === xs[0]);
            const isVertical = ys.every(y => y === ys[0]);
            expect(isHorizontal || isVertical).toBe(true);
            if (isHorizontal) {
                const sortedYs = ys.slice().sort((a, b) => a - b);
                for (let i = 1; i < sortedYs.length; i++) {
                    expect(sortedYs[i]).toBe(sortedYs[i - 1] + 1);
                }
            } else {
                const sortedXs = xs.slice().sort((a, b) => a - b);
                for (let i = 1; i < sortedXs.length; i++) {
                    expect(sortedXs[i]).toBe(sortedXs[i - 1] + 1);
                }
            }
        }
    });

    it('fake random function should create a predictable board', () => {
        let callCount = 0;
        const board = createRandomBoard(fakeRandomGenerator());
        expect(board.ships.length).toBe(Object.keys(FLEET).length);
        expect(board.ships.map(ship => ship.name).sort()).toEqual(Object.keys(FLEET).sort());
        expect(board.ships.map(ship => ship.cells.length).sort()).toEqual(Object.values(FLEET).sort());
        expect(board.ships[0].cells).toEqual([{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 }]);
        expect(board.ships[1].cells).toEqual([{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 }]);
        expect(board.ships[2].cells).toEqual([{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }]);
        expect(board.ships[3].cells).toEqual([{ x: 3, y: 0 }, { x: 3, y: 1 }, { x: 3, y: 2 }]);
        expect(board.ships[4].cells).toEqual([{ x: 4, y: 0 }, { x: 4, y: 1 }]);
    });

    it('pass () => 0 throws an error because it cannot place ships', () => {
        expect(() => createRandomBoard(() => 0)).toThrow(/Failed to place ship/);
    });
});
