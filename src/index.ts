export type { Direction, Tile, Board, Position } from "./2048/types.js";
export { createBoard } from "./2048/board.js";
export { move } from "./2048/move.js";
export { spawn } from "./2048/spawn.js";
export { score, hasMoves, canMove } from "./2048/rules.js";
export type { ShipName, Coordinate, Ship, Shot, BattleshipBoard} from "./battleship/types.js";
export { BOARD_SIZE, FLEET} from "./battleship/constants.js"
export { isShipSunk, isValidShot, getSunkShips, isGameComplete } from "./battleship/rules.js";
export { updateBoard, createRandomBoard } from "./battleship/board.js";
