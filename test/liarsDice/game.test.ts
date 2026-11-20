import type { Face, BidFace, Player, PublicPlayer, GameState } from '../../src/liarsDice/types.js';
import { MIN_PLAYERS, STARTING_DICE} from '../../src/liarsDice/constants.js';
import { startGame, applyBid, applyChallenge, removePlayer, setConnected } from '../../src/liarsDice/game.js';
import { viewFor } from '../../src/liarsDice/view.js';
import { fakeRandomGenerator } from './helper.js';
import { describe, it, expect } from 'vitest';

describe ('startGame', () => {
    it('should throw an error if there are not enough players', () => {
        const players: Player[] = [
            { id: '1', username: 'Alice', dice: [], connected: true },
            { id: '2', username: 'Bob', dice: [], connected: true },
        ];
        const random = fakeRandomGenerator();
        expect(() => startGame(players, random)).toThrow(/Not enough players/);
    });

    it('should initialize the game state correctly', () => {
        const players: Player[] = [
            { id: '1', username: 'Alice', dice: [], connected: true },
            { id: '2', username: 'Bob', dice: [], connected: true },
            { id: '3', username: 'Charlie', dice: [], connected: true },
        ];
        const random = fakeRandomGenerator();
        const gameState = startGame(players, random);
        expect(gameState.status).toBe('playing');
        expect(gameState.players.length).toBe(3);
        expect(gameState.turnPlayerId).toBe('1');
        expect(gameState.players[0].dice.length).toBe(STARTING_DICE);
        expect(gameState.players[1].dice.length).toBe(STARTING_DICE);
        expect(gameState.players[2].dice.length).toBe(STARTING_DICE);
        expect(gameState.players[0].dice).toEqual([1, 6, 1, 6, 1]); // Alternating between 1 and 6
        expect(gameState.lastReveal).toBeNull();
        expect(gameState.winnerId).toBeNull();
    });
});

describe ('applyBid', () => {
    it('should throw an error if the game is not in playing state', () => {
        const state: GameState = {
            status: 'finished',
            players: [],
            turnPlayerId: '',
            currentBid: null,
            lastReveal: null,
            winnerId: null,
        };
        expect(() => applyBid(state, '1', { quantity: 1, face: 2 })).toThrow(/Game is not in playing state/);
    });

    it('should throw an error if it is not the player\'s turn', () => {
        const state: GameState = {
            status: 'playing',
            players: [
                { id: '1', username: 'Alice', dice: [], connected: true }, 
                { id: '2', username: 'Bob', dice: [], connected: true }, 
                { id: '3', username: 'Charlie', dice: [], connected: true }],
            turnPlayerId: '1',
            currentBid: null,
            lastReveal: null,
            winnerId: null,
        };
        expect(() => applyBid(state, '2', { quantity: 1, face: 2 })).toThrow(/Not your turn/);
    });

    it('should throw an error if the bid quantity is not a positive integer', () => {
        const state: GameState = {
            status: 'playing',
            players: [
                { id: '1', username: 'Alice', dice: [], connected: true },
                { id: '2', username: 'Bob', dice: [], connected: true },
                { id: '3', username: 'Charlie', dice: [], connected: true }
            ],
            turnPlayerId: '1',
            currentBid: null,
            lastReveal: null,
            winnerId: null,
        };
        expect(() => applyBid(state, '1', { quantity: 0, face: 2 })).toThrow(/Bid quantity must be a positive integer/);
        expect(() => applyBid(state, '1', { quantity: -1, face: 2 })).toThrow(/Bid quantity must be a positive integer/);
        expect(() => applyBid(state, '1', { quantity: 1.5, face: 2 })).toThrow(/Bid quantity must be a positive integer/);
    });

    it('should throw an error if the bid is not higher than the current bid', () => {
        const state: GameState = {
            status: 'playing',
            players: [
                { id: '1', username: 'Alice', dice: [], connected: true },
                { id: '2', username: 'Bob', dice: [], connected: true },
                { id: '3', username: 'Charlie', dice: [], connected: true }
            ],
            turnPlayerId: '1',
            currentBid: { playerId: '2', bid: { quantity: 2, face: 3 } },
            lastReveal: null,
            winnerId: null,
        };
        expect(() => applyBid(state, '1', { quantity: 1, face: 4 })).toThrow(/Bid is not higher than the current bid/);
        expect(() => applyBid(state, '1', { quantity: 2, face: 2 })).toThrow(/Bid is not higher than the current bid/);
    });

    it('should update the game state correctly for a valid bid', () => {
        const dice: Face[] = [1, 2, 3, 4, 5];
        const state: GameState = {
            status: 'playing',
            players: [
                { id: '1', username: 'Alice', dice: dice, connected: true },
                { id: '2', username: 'Bob', dice: dice, connected: true },
                { id: '3', username: 'Charlie', dice: dice, connected: true }
            ],
            turnPlayerId: '1',
            currentBid: null,
            lastReveal: null,
            winnerId: null,
        };
        const newState = applyBid(state, '1', { quantity: 2, face: 3 });
        expect(newState.currentBid).toEqual({ playerId: '1', bid: { quantity: 2, face: 3 } });
        expect(newState.turnPlayerId).toBe('2');
    });

    it('should skip the turn of a player who has no dice left', () => {
        const dice: Face[] = [1, 2, 3, 4, 5];
        const state: GameState = {
            status: 'playing',
            players: [
                { id: '1', username: 'Alice', dice: dice, connected: true },
                { id: '2', username: 'Bob', dice: [], connected: true }, // Bob has no dice left
                { id: '3', username: 'Charlie', dice: dice, connected: true }
            ],
            turnPlayerId: '1',
            currentBid: null,
            lastReveal: null,
            winnerId: null,
        };
        const newState = applyBid(state, '1', { quantity: 2, face: 3 });
        expect(newState.currentBid).toEqual({ playerId: '1', bid: { quantity: 2, face: 3 } });
        expect(newState.turnPlayerId).toBe('3'); // Turn should skip Bob and go to Charlie
    });
});

describe('removePlayer', () => {
    it('should remove the player and update the game state correctly', () => {
        const dice: Face[] = [1, 2, 3, 4, 5];
        const state: GameState = {
            status: 'playing',
            players: [
                { id: '1', username: 'Alice', dice: dice, connected: true },
                { id: '2', username: 'Bob', dice: dice, connected: true },
                { id: '3', username: 'Charlie', dice: dice, connected: true }
            ],
            turnPlayerId: '2',
            currentBid: null,
            lastReveal: null,
            winnerId: null,
        };
        const random = fakeRandomGenerator();
        const newState = removePlayer(state, '2', random);
        expect(newState.players.length).toBe(3); // Player is not removed from the list, but their dice are set to empty
        expect(newState.players.find(p => p.id === '2')?.dice.length).toBe(0);
        expect(newState.players.find(p => p.id === '2')?.connected).toBe(false);
        expect(newState.players.find(p => p.id === '1')?.dice.length).toBe(5);
        expect(newState.players.find(p => p.id === '3')?.dice.length).toBe(5);
        expect(newState.turnPlayerId).toBe('3'); // 2 is removed, so next turn goes to 3
        expect(newState.status).toBe('playing');
        expect(newState.winnerId).toBeNull();
    });
});

describe('applyChallenge', () => {
    const dice: Face[] = [1, 2, 3, 4, 5];
    it('should throw an error if the game is already finished', () => {
        const state: GameState = {
            status: 'finished',
            players: [],
            turnPlayerId: '',
            currentBid: null,
            lastReveal: null,
            winnerId: null,
        };
        const random = fakeRandomGenerator();
        expect(() => applyChallenge(state, '1', random)).toThrow(/Game is already finished/);
    });

    it('should throw an error if it is not the player\'s turn', () => {
        const state: GameState = {
            status: 'playing',
            players: [
                { id: '1', username: 'Alice', dice: dice, connected: true },
                { id: '2', username: 'Bob', dice: dice, connected: true },
                { id: '3', username: 'Charlie', dice: dice, connected: true }
            ],
            turnPlayerId: '1',
            currentBid: { playerId: '2', bid: { quantity: 2, face: 3 } },
            lastReveal: null,
            winnerId: null,
        };
        const random = fakeRandomGenerator();
        expect(() => applyChallenge(state, '2', random)).toThrow(/Not your turn/);
    });

    it('should throw an error if there is no current bid to challenge', () => {
        const state: GameState = {
            status: 'playing',
            players: [
                { id: '1', username: 'Alice', dice: [], connected: true },
                { id: '2', username: 'Bob', dice: [], connected: true },
                { id: '3', username: 'Charlie', dice: [], connected: true }
            ],
            turnPlayerId: '1',
            currentBid: null,
            lastReveal: null,
            winnerId: null,
        };
        const random = fakeRandomGenerator();
        expect(() => applyChallenge(state, '1', random)).toThrow(/No bid to challenge/);
    });

    it('should update the game state correctly after a unsuccessful challenge', () => {
        const state: GameState = {
            status: 'playing',
            players: [
                { id: '1', username: 'Alice', dice: [1, 2, 3, 4, 5], connected: true },
                { id: '2', username: 'Bob', dice: [1, 2, 3, 4, 5], connected: true },
                { id: '3', username: 'Charlie', dice: [1, 2, 3, 4, 5], connected: true }
            ],
            turnPlayerId: '1',
            currentBid: { playerId: '2', bid: { quantity: 2, face: 3 } },
            lastReveal: null,
            winnerId: null,
        };
        const random = fakeRandomGenerator();
        const newState = applyChallenge(state, '1', random);
        expect(newState.lastReveal?.bid).toEqual({ quantity: 2, face: 3 });
        expect(newState.lastReveal?.bidderId).toBe('2');
        expect(newState.lastReveal?.challengerId).toBe('1');
        expect(newState.lastReveal?.actualCount).toBe(6); // There are six dice showing 3 (two from each player)
        expect(newState.lastReveal?.loserId).toBe('1'); // Alice's challenge fails
        expect(newState.players.find(p => p.id === '1')?.dice.length).toBe(4); // lose 1 dice
        expect(newState.turnPlayerId).toBe('1'); // Next turn goes to the loser
        // players got rerolled
        expect(newState.players.find(p => p.id === '1')?.dice).toEqual([1, 6, 1, 6]); // Alternating between 1 and 6
        expect(newState.players.find(p => p.id === '2')?.dice).toEqual([1, 6, 1, 6, 1]);
        expect(newState.players.find(p => p.id === '3')?.dice).toEqual([6, 1, 6, 1, 6]);
    });

    it (`should update the game state correctly after a successful challenge`, () => {
        const state: GameState = {
            status: 'playing',
            players: [
                { id: '1', username: 'Alice', dice: [1, 2, 3, 4, 5], connected: true },
                { id: '2', username: 'Bob', dice: [1], connected: true },
                { id: '3', username: 'Charlie', dice: [1, 2, 3, 4, 5], connected: true }
            ],
            turnPlayerId: '1',
            currentBid: { playerId: '2', bid: { quantity: 4, face: 6 } },
            lastReveal: null,
            winnerId: null,
        };
        const random = fakeRandomGenerator();
        const newState = applyChallenge(state, '1', random);
        expect(newState.lastReveal?.bid).toEqual({ quantity: 4, face: 6 });
        expect(newState.lastReveal?.bidderId).toBe('2');
        expect(newState.lastReveal?.challengerId).toBe('1');
        expect(newState.lastReveal?.actualCount).toBe(3); // There are three dice showing 6 (one from each player)
        expect(newState.lastReveal?.loserId).toBe('2'); // Alice's challenge is successful, bidder Bob loses
        expect(newState.players.find(p => p.id === '2')?.dice.length).toBe(0); // bidder Bob lose 1 dice and but not disconnected
        expect(newState.players.find(p => p.id === '2')?.connected).toBe(true); // bob still online to watch
        expect(newState.turnPlayerId).toBe('3'); // Next turn goes to the next active player
    });

    it('should set the game status to finished if there is a winner after a challenge', () => {
        const state: GameState = {
            status: 'playing',
            players: [
                { id: '1', username: 'Alice', dice: [1], connected: true },
                { id: '2', username: 'Bob', dice: [], connected: true },
                { id: '3', username: 'Charlie', dice: [1, 2, 3, 4, 5], connected: true }
            ],
            turnPlayerId: '1',
            currentBid: { playerId: '3', bid: { quantity: 2, face: 6 } },
            lastReveal: null,
            winnerId: null,
        };
        const random = fakeRandomGenerator();
        const newState = applyChallenge(state, '1', random);
        expect(newState.status).toBe('finished');
        expect(newState.players.find(p => p.id === '1')?.dice.length).toBe(0); // Alice loses her last dice
        expect(newState.turnPlayerId).toBe('3'); // Next turn goes to the winner if game is finished
        expect(newState.winnerId).toBe('3'); // Charlie is the only player left with dice
    });

    describe('viewFor', () => {
        it('should return the correct player view', () => {
            const state: GameState = {
                status: 'playing',
                players: [
                    { id: '1', username: 'Alice', dice: [1, 2, 3], connected: true },
                    { id: '2', username: 'Bob', dice: [4, 5, 6], connected: true },
                    { id: '3', username: 'Charlie', dice: [1, 2, 3], connected: true }
                ],
                turnPlayerId: '1',
                currentBid: { playerId: '1', bid: { quantity: 2, face: 3 } },
                lastReveal: null,
                winnerId: null,
            };
            const playerView = viewFor(state, '1');
            expect(playerView.yourId).toBe('1');
            expect(playerView.dice).toEqual([1, 2, 3]);
            expect(playerView.players.length).toBe(3);
            expect(playerView.players[0]).toEqual({ id: '1', username: 'Alice', diceCount: 3, connected: true });
            expect(playerView.players[1]).toEqual({ id: '2', username: 'Bob', diceCount: 3, connected: true });
            expect(playerView.players[2]).toEqual({ id: '3', username: 'Charlie', diceCount: 3, connected: true });
            expect(playerView.status).toBe('playing');
            expect(playerView.turnPlayerId).toBe('1');
            expect(playerView.currentBid).toEqual({ playerId: '1', bid: { quantity: 2, face: 3 } });
            expect(playerView.lastReveal).toBeNull();
            expect(playerView.winnerId).toBeNull();
        });
    });
});
