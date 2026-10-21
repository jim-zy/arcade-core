import type { Board } from "./types.js";

export function createBoard(): Board {
    return {
        size: 4,
        tiles: [],
        nextId: 1
    };
}
