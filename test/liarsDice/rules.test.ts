import { isHigherBid } from "../../src/liarsDice/rules.js";
import { describe, it, expect } from 'vitest';
import type { Bid } from "../../src/liarsDice/types.js";

describe('isHigherBid', () => {
    it('should return true for a higher quantity', () => {
        const previousBid: Bid = { quantity: 3, face: 4 };
        const newBid: Bid = { quantity: 4, face: 2 };
        expect(isHigherBid(newBid, previousBid)).toBe(true);
    });

    it('should return true for the same quantity but higher face', () => {
        const previousBid: Bid = { quantity: 3, face: 4 };
        const newBid: Bid = { quantity: 3, face: 5 };
        expect(isHigherBid(newBid, previousBid)).toBe(true);
    });

    it('should return false for a lower quantity', () => {
        const previousBid: Bid = { quantity: 3, face: 4 };
        const newBid: Bid = { quantity: 2, face: 6 };
        expect(isHigherBid(newBid, previousBid)).toBe(false);
    });

    it('should return false for the same quantity and lower face', () => {
        const previousBid: Bid = { quantity: 3, face: 4 };
        const newBid: Bid = { quantity: 3, face: 3 };
        expect(isHigherBid(newBid, previousBid)).toBe(false);
    });

    it('should return true if there is no previous bid', () => {
        const newBid: Bid = { quantity: 1, face: 2 };
        expect(isHigherBid(newBid, null)).toBe(true);
    });
});