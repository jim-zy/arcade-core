import { MIN_PLAYERS, STARTING_DICE } from './constants.js';
import type { Player, Bid, Face, GameState } from './types.js';
import { countMatching, rollDice } from './dice.js';
import { isHigherBid, resolveChallenge } from './rules.js';

export function startGame(players: Player[], random: () => number): GameState {
    if (players.length < MIN_PLAYERS) throw new Error(`Not enough players to start the game. Minimum required: ${MIN_PLAYERS}`);
    //each player roll their dice
    const updatedPlayers = players.map((player) => ({
        ...player,
        dice: rollDice(STARTING_DICE, random),
    }));
    
    return {
        status: 'playing',
        players: updatedPlayers,
        turnPlayerId: updatedPlayers[0]!.id,
        currentBid: null,
        lastReveal: null,
        winnerId: null,
    };
}

export function applyBid(state: GameState, playerId: string, bid: Bid): GameState {
    if (state.status !== 'playing') throw new Error('Game is not in playing state');
    if (state.turnPlayerId !== playerId) throw new Error('Not your turn');
    if (!Number.isInteger(bid.quantity) || bid.quantity <= 0) throw new Error('Bid quantity must be a positive integer');
    if (!isHigherBid(bid, state.currentBid?.bid ?? null)) throw new Error('Bid is not higher than the current bid');
    return {
        ...state,
        currentBid: { playerId, bid },
        turnPlayerId: nextActivePlayer(state.players, playerId),
    };
}

export function applyChallenge(state: GameState, playerId: string, random: () => number): GameState {
    if (state.status === 'finished') throw new Error('Game is already finished');
    if (state.turnPlayerId !== playerId) throw new Error('Not your turn');
    if (state.currentBid === null) throw new Error('No bid to challenge');

    const allDice = state.players.flatMap((player) => player.dice);
    const bidStands = resolveChallenge(state.currentBid.bid, allDice);
    const loserId = bidStands ? playerId : state.currentBid.playerId;
    const lastReveal = {
        bid: state.currentBid.bid,
        bidderId: state.currentBid.playerId,
        challengerId: playerId,
        actualDice: Object.fromEntries(state.players.map((player) => [player.id, player.dice])),
        actualCount: countMatching(allDice, state.currentBid.bid.face),
        loserId,
    };
    
    const updatedPlayers = state.players.map((player) => {
        const newDiceCount = player.id === loserId ? Math.max(player.dice.length - 1, 0) : player.dice.length;
        return {
            ...player,
            dice: rollDice(newDiceCount, random)
        };
    });
    
    const isLoserOut = updatedPlayers.find((player) => player.id === loserId)?.dice.length === 0;
    const nextTurnPlayerId = isLoserOut ? nextActivePlayer(updatedPlayers, loserId) : loserId;
    const winnerId = checkWinner(updatedPlayers);

    return {
        status: winnerId ? 'finished' : 'playing',
        players: updatedPlayers,
        turnPlayerId: winnerId ? winnerId : nextTurnPlayerId,
        currentBid: null,
        lastReveal,
        winnerId,
    };
}

export function removePlayer(state: GameState, playerId: string, random: () => number): GameState {
    if (state.status === 'finished') throw new Error('Game is already finished');
    // player is already out, no need to remove
    const target = state.players.find((player) => player.id === playerId);
    if (!target || target.dice.length === 0) return state;
    // remove the player and reroll other players' dice
    const updatedPlayers = state.players.map((player) => {
        if (player.id === playerId) {
            return { ...player, dice: [], connected: false };
        }
        return {
            ...player,
            dice: rollDice(player.dice.length, random),
        };
    });

    const winnerId = checkWinner(updatedPlayers);

    return {
        ...state,
        status: winnerId ? 'finished' : 'playing',
        players: updatedPlayers,
        turnPlayerId: playerId === state.turnPlayerId ? nextActivePlayer(updatedPlayers, playerId) : state.turnPlayerId,
        currentBid: null,
        lastReveal: null,
        winnerId,
    };
}

function checkWinner(players: Player[]): string | null {
    const activePlayers = players.filter((player) => player.dice.length > 0);
    return activePlayers.length === 1 ? activePlayers[0]!.id : null;
}

function nextActivePlayer(players: Player[], currentPlayerId: string): string {
    const currentIndex = players.findIndex((p) => p.id === currentPlayerId);
    for (let i = 1; i < players.length; i++) {
        const nextIndex = (currentIndex + i) % players.length;
        if (players[nextIndex]!.dice.length > 0) {
            return players[nextIndex]!.id;
        }
    }
    throw new Error('No active players found');
}

export function setConnected(state: GameState, playerId: string, connected: boolean): GameState {
    const updatedPlayers = state.players.map((player) => {
        if (player.id === playerId) {
            return { ...player, connected };
        }
        return player;
    });
    return { ...state, players: updatedPlayers };
}