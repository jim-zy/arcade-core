import { describe, it, expect } from "vitest";
import { spawn } from "../src/2048/spawn.js";
import type { Board } from "../src/2048/types.js";
import {makeBoard} from "./helper.js";

// return values[0], values[1], values[2], ... in a loop
function fakeRng(values: number[]): () => number {
    let index = 0;
    return () => {
        const value = values[index % values.length] ?? 0;
        index++;
        return value;
    };
}

describe("spawn", () => {
    it("should spawn a new tile in the first cell of an empty board", () => {
        const board: Board = {
            size: 4,
            tiles: [],
            nextId: 1
        };
        const rng = fakeRng([0, 0]); // Always return 0 for position and value
        const newBoard = spawn(board, rng);
        expect(newBoard.tiles.length).toBe(1);
        expect(newBoard.tiles[0]).toMatchObject({
            id: 1,
            value: 2,
            row: 0,
            col: 0,
            merged: false,
            isNew: true
        });
        expect(newBoard.nextId).toBe(2);
    });

    it("should spawn a new tile in the last empty cell with value 4", () => {
        const board: Board = {
            size: 4,
            tiles: [],
            nextId: 1
        };
        const rng = fakeRng([0.99, 0.95]); // Always return 0.99 for position and 0.95 for value
        const newBoard = spawn(board, rng);
        expect(newBoard.tiles.length).toBe(1);
        expect(newBoard.tiles[0]).toMatchObject({
            id: 1,
            value: 4,
            row: 3,
            col: 3,
            merged: false,
            isNew: true
        });
        expect(newBoard.nextId).toBe(2);
    });

    it("should return the exact cell when there is only one empty cell", () => {
            const board: Board = makeBoard([
                [2, 4, 2, 4],
                [4, 2, 4, 2],
                [2, 4, 2, 4],
                [4, 2, 4, 0]
            ]);
        const rng = fakeRng([0]); // Always return 0 for position
        const newBoard = spawn(board, rng);
        expect(newBoard.tiles.length).toBe(16);
        expect(newBoard.tiles[15]).toMatchObject({
            id: 16,
            value: 2,
            row: 3,
            col: 3,
            merged: false,
            isNew: true
        });
        expect(newBoard.nextId).toBe(17);
    });

    it("should return the same board if there are no empty cells", () => {
        const board: Board = makeBoard([
            [2, 4, 2, 4],
            [4, 2, 4, 2],
            [2, 4, 2, 4],
            [4, 2, 4, 2]
        ]);
        const rng = fakeRng([0]); // Always return 0 for position
        const newBoard = spawn(board, rng);
        expect(newBoard).toEqual(board);
    });

    it("should keep the purity of original board", () => {
        const board: Board = {
            size: 4,
            tiles: [],
            nextId: 1
        };
        const rng = fakeRng([0, 0]);
        const copy = structuredClone(board);
        const newBoard = spawn(board, rng);
        expect(newBoard).not.toBe(board);
        expect(board).toStrictEqual(copy);
    });
});