import type { Bid, BidFace, PlayerView } from "./types.js";

export type ClientMessage =
    | { type: 'auth'; payload: { ticket: string } }
    | { type: 'start'; payload: Record<string, never> }
    | { type: 'bid'; payload: Bid }
    | { type: 'challenge'; payload: Record<string, never> };

export type ServerMessage =
    | { type: 'lobby'; payload: { roomId: string; 
        players: { id: string; username: string; connected: boolean }[] } }
    | { type: 'state'; payload: PlayerView }
    | { type: 'error'; payload: { message: string } };



export function parseClientMessage(raw: unknown): ClientMessage {
    if (typeof raw !== "object" || raw === null) {
        throw new Error("Invalid message format");
    }

    const message = raw as Record<string, unknown>;

    switch (message.type) {
        case "auth": {
            if (typeof message.payload !== "object" || message.payload === null) {
                throw new Error("Invalid auth payload");
            }
            const p = message.payload as Record<string, unknown>;
            if (typeof p.ticket !== "string") {
                throw new Error("Invalid auth ticket");
            }
            return { type: "auth", payload: { ticket: p.ticket } };
        }
        case "start":
            return { type: "start", payload: {} };
        case "bid": {
            if (typeof message.payload !== "object" || message.payload === null) {
                throw new Error("Invalid bid payload");
            }
            const p = message.payload as Record<string, unknown>;
            const bidQuantity = p.quantity;
            const bidFace = p.face;
            if (typeof bidQuantity !== "number" || !Number.isInteger(bidQuantity) || bidQuantity <= 0) {
                throw new Error("Invalid bid quantity");
            }
            if (typeof bidFace !== "number" || ![2, 3, 4, 5, 6].includes(bidFace)) {
                throw new Error("Invalid bid face");
            }
            return { type: "bid", payload: { quantity: bidQuantity, face: bidFace as BidFace } };
        }
        case "challenge":
            return { type: "challenge", payload: {} };
        default:
            throw new Error(`Unknown message type: ${message.type}`);
    }
}
