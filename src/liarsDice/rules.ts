import type { Bid, Face } from "./types.js";
import { countMatching } from "./dice.js";

export function isHigherBid(bid: Bid, previousBid: Bid | null): boolean {
    if (previousBid === null) {
        return true;
    }
    return (
        bid.quantity > previousBid.quantity 
        || (bid.quantity === previousBid.quantity && bid.face > previousBid.face)   
    );
}

export function resolveChallenge(bid: Bid, allDice: Face[]): boolean {
    return countMatching(allDice, bid.face) >= bid.quantity;
}