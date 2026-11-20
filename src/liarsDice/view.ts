import type { GameState, PlayerView } from './types.js';

export function viewFor(gameState: GameState, playerId: string): PlayerView {
    return {
        yourId: playerId,
        dice: gameState.players.find((player) => player.id === playerId)?.dice ?? [],
        players: gameState.players.map((player) => ({
            id: player.id,
            username: player.username,
            diceCount: player.dice.length,
            connected: player.connected,
        })),
        status: gameState.status,
        turnPlayerId: gameState.turnPlayerId,
        currentBid: gameState.currentBid,
        lastReveal: gameState.lastReveal,
        winnerId: gameState.winnerId
    };
}