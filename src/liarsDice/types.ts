export type Face = 1 | 2 | 3 | 4 | 5 | 6;

// one is the wild card, so it is not included in the bid faces
export type BidFace = 2 | 3 | 4 | 5 | 6;

export type GameStatus = 'playing' | 'finished';

export interface Bid {
    quantity: number;
    face: BidFace;
}

// dice length=0 is out
export interface Player {
    id: string;
    username: string;
    dice: Face[];
    connected: boolean;
}

export interface Reveal {
    bid: Bid;
    bidderId: string;
    challengerId: string;
    actualDice: { [playerId: string]: Face[] };
    actualCount: number;
    loserId: string;
}

export interface GameState {
    status: GameStatus;
    players: Player[];
    turnPlayerId: string;
    currentBid: { playerId: string; bid: Bid } | null;
    lastReveal: Reveal | null;
    winnerId: string | null;
}

export interface PublicPlayer {
    id: string;
    username: string;
    diceCount: number;
    connected: boolean;
}

export interface PlayerView {
    yourId: string;
    dice: Face[];
    players: PublicPlayer[];
    status: GameStatus;
    turnPlayerId: string;
    currentBid: { playerId: string; bid: Bid } | null;
    lastReveal: Reveal | null;
    winnerId: string | null;
}