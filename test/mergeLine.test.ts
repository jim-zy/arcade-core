import {describe, it, expect} from 'vitest';
import {mergeLine} from '../src/2048/move.js';
import type {Tile} from '../src/2048/types.js';

function makeLine(values: number[]): Tile[] {
    return values.map((value, index) => ({
        id: index + 1,
        value,
        row: 0,
        col: index,
        merged: false,
        isNew: false
    }));
}

describe('mergeLine', () => {
    it('should merge tiles correctly', () => {
        const line = makeLine([2, 2, 4, 4]);
        const result = mergeLine(line, 5);
        expect(result.tiles.map(t => t.value)).toEqual([4, 8]);
        expect(result.points).toBe(12);
        expect(result.nextId).toBe(7);
    });

    it('should handle no merges', () => {
        const line = makeLine([2, 4, 8]);
        const result = mergeLine(line, 4);
        expect(result.tiles.map(t => t.value)).toEqual([2, 4, 8]);
        expect(result.points).toBe(0);
        expect(result.nextId).toBe(4);
    });

    it('should handle single tile', () => {
        const line = makeLine([2]);
        const result = mergeLine(line, 2);
        expect(result.tiles.map(t => t.value)).toEqual([2]);
        expect(result.points).toBe(0);
        expect(result.nextId).toBe(2);
    });

    it('should handle empty line', () => {
        const line: Tile[] = [];
        const result = mergeLine(line, 1);
        expect(result.tiles).toEqual([]);
        expect(result.points).toBe(0);
        expect(result.nextId).toBe(1);
    });

    it('should handle multiple merges in a row', () => {
        const line = makeLine([2, 2, 2, 2]);
        const result = mergeLine(line, 5);
        expect(result.tiles.map(t => t.value)).toEqual([4, 4]);
        expect(result.points).toBe(8);
        expect(result.nextId).toBe(7);
    });

    it('should give a merged tile a new id and keeps the id of a tile that moved only', () => {
        const line = makeLine([2, 2, 4]);
        const result = mergeLine(line, 5);
        expect(result.tiles).toMatchObject([
            { id: 5, value: 4, merged: true },
            { id: 3, value: 4, merged: false }
        ]);
    });

    it ('should have stale flags except for merged tiles', () => {
        const line = makeLine([2, 2, 4]);
        const result = mergeLine(line, 5);
        expect(result.tiles).toMatchObject([
            { merged: true, isNew: false },
            { merged: false, isNew: false }
        ]);
    });

    it ('should only merge the left pair of tiles when there are three in a row', () => {
        const line = makeLine([2, 2, 2]);
        const result = mergeLine(line, 4);
        expect(result.tiles.map(t => t.value)).toEqual([4, 2]);
        expect(result.points).toBe(4);
        expect(result.nextId).toBe(5);
    });

    it ('should not change the input tiles', () => {
        const line = makeLine([2, 2, 4]);
        const originalLine = structuredClone(line);
        mergeLine(line, 5);
        expect(line).toEqual(originalLine);
    });
});