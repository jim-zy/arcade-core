import type { BattleshipBoard, Shot, Ship } from '../../src/battleship/types'

export function makeBoard(shots: Shot[] = [], ships: Ship[] = []): BattleshipBoard {
    return {
        ships: ships,
        shots: shots 
    }
}

export function fakeRandomGenerator(): () => number {
    // 3 indices for 1 ship (orientation, x , y)
    // all vertical placing on first row y=0
    const values = [1, 0, 0, 1, 0.1, 0, 1, 0.2, 0, 1, 0.3, 0, 1, 0.4, 0];
    let index = 0;
    return () => {
        if (index >= values.length) {
            throw new Error("Ran out of fake random values");
        }
        const value = values[index++];
        return value;
    };
}