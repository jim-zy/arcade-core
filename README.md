# @peacestay/arcade-core

Arcade core package for 2048, Battleship and Liar's Dice game logics, for Student Zhiyuan Zhao in CS5610 course

## Install

```bash
npm install @peacestay/arcade-core
```

## Development
```bash
npm install
npm run build && npm test
npm publish --access public
```

## Get started

```ts
import { createBoard, spawn, move, score, hasMoves } from '@peacestay/arcade-core';
const board = createBoard();
const firstSpawn = spawn(board);
const secondSpawn = spawn(firstSpawn);
const movedBoard = move(secondSpawn, 'left') // movedBoard is the same if no moved nor merged
```

create a board with no tiles -> spawn twice to get started
choose a direction to move -> check if the board changed, either merged or moved
if changed -> add the score() is merged -> spawn again
if not changed -> not a valid move, return the same board
if hasMoves() is false -> game ends

## API

### 2048

#### `createBoard(): Board`
create a Board object with empty cells

#### `move(board, direction): Board`
move a board given the direction, merge or just move the cells if possible, return the same board if neither

#### `spawn(board, rng?): Board`
spawn a cell with value 2 or 4, rng is optional, math.random by default
call rng first to pick a cell, and call it again for 2 or 4 (<0.9 -> 2, else 4)

#### `score(board): number`
points earned by the move 

#### `hasMoves(board): boolean`
use move in four directions too see if any move is possible

#### `canMove(board, direction): boolean`
boolean flag if the board could move in a specific direction

### Battleship

#### `createRandomBoard`
creates a board with random distrubtion of fleet, retry limit to 100\

#### `updateBoard(BattleshipBoard, x, y)` 
adds a Shot of x, y coord with the hit flag, return the new board

### Liar's Dice

All functions are pure and return a new state, the old one is never changed.
`random` is passed in (e.g. `Math.random`) so tests can use a fake one.
Functions that change the game throw an `Error` on an illegal move.

#### Rules used

- 3 or more players to start, each with 5 dice
- every player re-rolls at the start of each round, you only see your own dice
- ones are wild, you can only bid on faces 2 to 6
- a bid must raise: a higher quantity, or the same quantity with a higher face
- a bid can be higher than the total number of dice on the table
- you can challenge the last bid. If the bid stands and the challenger loses a die, otherwise the bidder loses a die
- the loser starts the next round, skip eliminated players
- a player with no dice is out, the last player with dice wins
- a player who leaves is out, and the round restarts

#### `rollDice(count, random): Face[]`
roll `count` dice, throws if `random` returns a value outside [0, 1)

#### `countMatching(allDice, face): number`
number of dice showing `face`, ones included

#### `isHigherBid(bid, previousBid): boolean`
true if `bid` raises `previousBid`, always true when `previousBid` is null

#### `resolveChallenge(bid, allDice): boolean`
true if the bid stands (enough matching dice)

#### `startGame(players, random): GameState`
everyone rolls 5 dice, first player in the list starts, throws with fewer than 3 players

#### `applyBid(state, playerId, bid): GameState`
place a bid and pass the turn to the next player with dice

#### `applyChallenge(state, playerId, random): GameState`
challenge the current bid, save the reveal, take a die from the loser, re-roll everyone, set the winner if only one player has dice left

#### `removePlayer(state, playerId, random): GameState`
set the player's dice to none, re-roll the others and clear the bid. Returns the same state if the player is already out or not in the game

#### `setConnected(state, playerId, connected): GameState`
update a player's connected flag, nothing else changes

#### `viewFor(state, playerId): PlayerView`
what one player is allowed to see: their own dice, and only the dice count of everyone else

## Key Types

### 2048

#### Board

Represents a board with size=4 by default, a list of Tiles and the id number of next cell
id starts at 1 incremented whenever there's a new tile spawned or a valid merge.

```ts
export interface Board {
	size: 4;
	tiles: Tile[];
	nextId: number;
}
```

#### Tile

Represents a cell with a value
id is number passed from the nextId in the board, row, col are the coords
merged is only true when a new tile generated from a merge
isNew is ture only when the tile was first added by a spawn (merged tile also has false flag)

```ts
export interface Tile {
	id: number;
	value: number;
	row: number;
	col: number;
	merged: boolean;
	isNew: boolean;
}
```

### Battleship

#### BattleshipBoard
Board with its list of Ship and Shot

```ts
export interface BattleshipBoard {
    ships: Ship[];
    shots: Shot[];
}
```

#### Ship
Ship with its name and coords list

```ts
export interface Ship {
    name: ShipName;
    cells: Coordinate[];
}
```

#### Shot
Shot extends coord and a hit flag=true if the shot is on a ship cell

```ts
export interface Shot extends Coordinate {
    hit: boolean;
}
```

### Liar's Dice

#### GameState
The full game, kept on the server only since it has everyone's dice

```ts
export interface GameState {
    status: 'playing' | 'finished';
    players: Player[];
    turnPlayerId: string;
    currentBid: { playerId: string; bid: Bid } | null;
    lastReveal: Reveal | null;
    winnerId: string | null;
}
```

#### Player
A player in the game, an empty `dice` list means the player is out

```ts
export interface Player {
    id: string;
    username: string;
    dice: Face[];
    connected: boolean;
}
```

#### Bid
A quantity and a face, e.g. "four 5s"

```ts
export interface Bid {
    quantity: number;
    face: BidFace; // 2 to 6
}
```

#### Reveal
The result of the last challenge, keeps each player's dice from that round

```ts
export interface Reveal {
    bid: Bid;
    bidderId: string;
    challengerId: string;
    actualDice: { [playerId: string]: Face[] };
    actualCount: number;
    loserId: string;
}
```

#### PlayerView
What one player receives: their own dice, and `PublicPlayer` (id, username, diceCount, connected) for everyone

```ts
export interface PlayerView {
    yourId: string;
    dice: Face[];
    players: PublicPlayer[];
    status: 'playing' | 'finished';
    turnPlayerId: string;
    currentBid: { playerId: string; bid: Bid } | null;
    lastReveal: Reveal | null;
    winnerId: string | null;
}
```
