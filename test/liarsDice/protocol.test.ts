import { describe, it, expect } from "vitest";
import { parseClientMessage } from "../../src/liarsDice/protocol.js";
import type { ClientMessage } from "../../src/liarsDice/protocol.js";

describe("parseClientMessage", () => {
    it("should parse valid auth message", () => {
        const raw = { type: "auth", payload: { ticket: "abc123" } };
        const result = parseClientMessage(raw);
        expect(result).toEqual({ type: "auth", payload: { ticket: "abc123" } });
    });

    it("should throw error for invalid auth message", () => {
        const raw = { type: "auth", payload: { ticket: 123 } };
        expect(() => parseClientMessage(raw)).toThrow("Invalid auth ticket");
    });

    it("should parse valid start message", () => {
        const raw = { type: "start", payload: {} };
        const result = parseClientMessage(raw);
        expect(result).toEqual({ type: "start", payload: {} });
    });

    it("should parse valid bid message", () => {
        const raw = { type: "bid", payload: { quantity: 3, face: 5 } };
        const result = parseClientMessage(raw);
        expect(result).toEqual({ type: "bid", payload: { quantity: 3, face: 5 } });
    });

    it("should throw error for invalid bid quantity message", () => {
        const raw = { type: "bid", payload: { quantity: -1, face: 5 } };
        expect(() => parseClientMessage(raw)).toThrow("Invalid bid quantity");
    });

    it("should throw error for invalid bid face message", () => {
        const raw = { type: "bid", payload: { quantity: 3, face: 1 } };
        expect(() => parseClientMessage(raw)).toThrow("Invalid bid face");
    });

    it("should parse valid challenge message", () => {
        const raw = { type: "challenge", payload: {} };
        const result = parseClientMessage(raw);
        expect(result).toEqual({ type: "challenge", payload: {} });
    });

    it("should throw error for unknown message type", () => {
        const raw = { type: "unknown", payload: {} };
        expect(() => parseClientMessage(raw)).toThrow("Unknown message type: unknown");
    });

    it("should throw error for non-object input", () => {
        const raw = "not an object";
        expect(() => parseClientMessage(raw)).toThrow("Invalid message format");
    });
});