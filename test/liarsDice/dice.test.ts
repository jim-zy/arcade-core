import { describe, it, expect } from 'vitest';
import { fakeRandomGenerator } from './helper.js';
import { rollDice, countMatching } from '../../src/liarsDice/dice.js';
import type { Face } from '../../src/liarsDice/types.js';

describe('rollDice', () => {
    it('should roll the correct number of dice', () => {
        const random = fakeRandomGenerator();
        const rolls = rollDice(5, random);
        expect(rolls.length).toBe(5);
    });

    it('should return valid face values', () => {
        const random = fakeRandomGenerator();
        const rolls = rollDice(5, random);
        expect(rolls).toEqual([1, 6, 1, 6, 1]); // Alternating between 1 and 6 based
    });

    it('should throw an error for invalid random index', () => {
        const badRandom = () => 1.5; // This will cause an invalid index
        expect(() => rollDice(1, badRandom)).toThrow(/Invalid random index/);
    });
});

describe('countMatching', () => {
    it('should count matching dice correctly', () => {
        const allDice: Face[] = [1, 2, 3, 1, 4, 5];
        const face = 3;
        const count = countMatching(allDice, face);
        expect(count).toBe(3); // Two 1s and one 3
    });

    it('should return 0 if no matches', () => {
        const allDice: Face[] = [2, 4, 5];
        const face = 3;
        const count = countMatching(allDice, face);
        expect(count).toBe(0);
    });
});