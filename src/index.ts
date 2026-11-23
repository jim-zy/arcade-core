// 2048
export type { Direction, Tile, Board, Position } from "./2048/types.js";
export { createBoard } from "./2048/board.js";
export { move } from "./2048/move.js";
export { spawn } from "./2048/spawn.js";
export { score, hasMoves, canMove } from "./2048/rules.js";
// battleship
export type { ShipName, Coordinate, Ship, Shot, BattleshipBoard} from "./battleship/types.js";
export { BOARD_SIZE, FLEET} from "./battleship/constants.js"
export { isShipSunk, isValidShot, getSunkShips, isGameComplete } from "./battleship/rules.js";
export { updateBoard, createRandomBoard } from "./battleship/board.js";
// liarsDice
export type { Face, BidFace, Reveal, PublicPlayer, PlayerView, Player, GameState, Bid } from "./liarsDice/types.js";
export { MIN_PLAYERS, STARTING_DICE } from "./liarsDice/constants.js";
export { rollDice, countMatching } from "./liarsDice/dice.js";
export { viewFor } from "./liarsDice/view.js";
export { startGame, applyBid, applyChallenge, removePlayer, setConnected } from "./liarsDice/game.js";
export { isHigherBid, resolveChallenge } from "./liarsDice/rules.js";
// realtime
export type { ClientMessage, ServerMessage } from "./liarsDice/protocol.js";
export { parseClientMessage } from "./liarsDice/protocol.js";
