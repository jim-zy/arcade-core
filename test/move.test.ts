import { describe, it, expect } from 'vitest';
import type {Board} from '../src/2048/types.js';
import {makeBoard, toGrid} from './helper.js';
import { move } from '../src/2048/move.js';

// check the helper functions
describe('makeBoard', () => {
    it('should create a board with the correct size and tiles', () => {
        const grid = [
            [2, 0, 0, 2],
            [0, 4, 0, 0],
            [0, 0, 8, 0],
            [16, 0, 0, 32]
        ];
        const board = makeBoard(grid);
        expect(board.size).toBe(4);
        expect(board.tiles.length).toBe(6);
        expect(board.nextId).toBe(7);
    });
});

describe('toGrid', () => {
    it('should convert a board back to a grid representation', () => {
        const grid = [
            [2, 0, 0, 2],
            [0, 4, 0, 0],
            [0, 0, 8, 0],
            [16, 0, 0, 32]
        ];
        const board = makeBoard(grid);
        const convertedGrid = toGrid(board);
        expect(convertedGrid).toEqual(grid);
    });
});

// different merge for the different lines in the same grid
describe('move', () => {
    const startGrid = [
        [2, 2, 0, 0],
        [0, 4, 0, 4],
        [2, 0, 2, 2],
        [0, 0, 0, 8]
    ];

    it('move left', () => {
        const board = makeBoard(startGrid);
        expect(toGrid(move(board, 'left'))).toEqual(
            [[4, 0, 0, 0],
             [8, 0, 0, 0],
             [4, 2, 0, 0],
             [8, 0, 0, 0]]
        );
    });

    it('move right', () => {
        const board = makeBoard(startGrid);
        expect(toGrid(move(board, 'right'))).toEqual(
            [[0, 0, 0, 4],
             [0, 0, 0, 8],
             [0, 0, 2, 4],
             [0, 0, 0, 8]]
        );
    });

    it('move up', () => {
        const board = makeBoard(startGrid);
        expect(toGrid(move(board, 'up'))).toEqual(
            [[4, 2, 2, 4],
             [0, 4, 0, 2],
             [0, 0, 0, 8],
             [0, 0, 0, 0]]
        );
    });

    it('move down', () => {
        const board = makeBoard(startGrid);
        expect(toGrid(move(board, 'down'))).toEqual(
            [[0, 0, 0, 0],
             [0, 0, 0, 4],
             [0, 2, 0, 2],
             [4, 4, 2, 8]]
        );
    });
});

// no change in the board, return same object
describe('move with no change', () => {
    const startGrid = [
        [2, 4, 8, 16],
        [32, 64, 128, 256],
        [512, 1024, 2048, 4096],
        [8192, 16384, 32768, 65536]
    ];

    it('should return the same board object when there is no change', () => {
        const board = makeBoard(startGrid);
        const newBoard = move(board, 'left');
        expect(newBoard).toBe(board); // Check if the same object is returned
    });
});

// merges in two lines, two new tiles have different ids, nextId should be updated correctly
describe('move with merges in two lines', () => {
    const startGrid = [
        [2, 2, 0, 0],
        [0, 4, 0, 4],
        [2, 0, 0, 0],
        [0, 0, 0, 8]
    ];

    it('should update nextId correctly after merges', () => {
        const board = makeBoard(startGrid);
        const newBoard = move(board, 'left');
        expect(newBoard.tiles.map(t => t.id)).toEqual([7, 8, 5, 6]);
        expect(newBoard.nextId).toBe(board.nextId + 2); // Two new tiles created
    });
});

// should not change the input board (structuredClone)
describe('move should not change the input board', () => {
    const startGrid = [
        [2, 2, 0, 0],
        [0, 4, 0, 4],
        [2, 0, 0, 0],
        [0, 0, 0, 8]
    ];

    it('should not change the input board', () => {
        const board = makeBoard(startGrid);
        const originalBoard = structuredClone(board);
        const newBoard = move(board, 'left');
        expect(toGrid(newBoard)).toEqual(
            [[4, 0, 0, 0],
             [8, 0, 0, 0],
             [2, 0, 0, 0],
             [8, 0, 0, 0]]
        );
        expect(board).toEqual(originalBoard); // Check if the original board is unchanged
    });
});
