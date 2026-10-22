import { describe, expect, it } from 'vitest';
import { makeBoard } from './helper.js';
import { score, hasMoves } from '../src/2048/rules.js';
import { move } from '../src/2048/move.js';

describe('score', () => {
    it ('should return 0 for an empty board', () => {
        const board = makeBoard([
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ]);
        expect(score(board)).toBe(0);
    });

    it ('should return the sum of two merged tiles in one move', () => {
        const board = makeBoard([
            [2, 2, 0, 0],
            [0, 4, 0, 4],
            [2, 0, 0, 0],
            [0, 0, 0, 8]
        ]);
        expect(score(board)).toBe(0); // No merges yet
        const newBoard = move(board, 'left');
        expect(score(newBoard)).toBe(12); // 2+2=4 and 4+4=8, total 12
    });
});

describe('hasMoves', () => {
    it ('should return true for hasMoves for one empty cell of a board', () => {
        const board = makeBoard([
            [2, 4, 2, 4],
            [4, 2, 4, 2],
            [2, 4, 2, 4],
            [4, 2, 4, 0]
        ]);
        expect(hasMoves(board)).toBe(true);
    });

    it ('should return false for hasMoves for a full board with no merges', () => {
        const board = makeBoard([
            [2, 4, 2, 4],
            [4, 2, 4, 2],
            [2, 4, 2, 4],
            [4, 2, 4, 8]
        ]);
        expect(hasMoves(board)).toBe(false);
    });

    it ('should return true for hasMoves for a full board with only one possible merge', () => {
        const board = makeBoard([
            [2, 4, 2, 4],
            [4, 2, 4, 2],
            [2, 4, 2, 8],
            [4, 2, 4, 4]
        ]);
        expect(hasMoves(board)).toBe(true);
    });

    it ('should return true for hasMoves for a full board with one up or down merge possible', () => {
        const board = makeBoard([
            [4, 8, 2, 4],
            [4, 2, 4, 2],
            [2, 4, 2, 4],
            [4, 2, 4, 8]
        ]);
        expect(hasMoves(board)).toBe(true);
    });
});