import type { BidFace, Face } from './types.js';

// bad random could undefine a face object in type script
export function rollDice(count: number, random: () => number): Face[] {
    const FACES: Face[] = [1, 2, 3, 4, 5, 6];
    const rolls: Face[] = [];

    for (let i = 0; i < count; i++) {
        const index = Math.floor(random() * FACES.length);
        if (FACES[index] === undefined) throw new Error(`Invalid random index: ${index}`);
        rolls.push(FACES[index]);
    }

    return rolls;
}

export function countMatching(allDice: Face[], face: BidFace): number {
    return allDice.filter((die) => die === face || die === 1).length;
}