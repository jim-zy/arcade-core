# Changelog

## [0.1.0] - 2026-10-22

### Added
- `createBoard()`, create an empty board
- `spawn(board, rng?)`, spawn a tile 2 or 4 on the board
- `move(board, direction)`, move in one chosen direction
- `score(board)`, collect the score
- `hasMoves(board)`, return true if any possible move left
- `Board`, represents a board with size of 4 and a list of tiles
- `Tile`, represents a tile with attributes
- `Direction`, union type of left, right, up and down
- `Position`, wrapper for row, col coord

## [0.2.0] - 2026-10-27

### Added
- `canMove(board, direction)`, flag for possible move in a certain direction, hasMoves now use canMove as helper function

### Note
score() was implemented before the update, keep it unchanged to display the score

## [0.3.0] - 2026-11-12

### Added
- `Coordinate`, represents a coord the battle field, x-col, y-row
- `Ship`, represents a Ship with its name and coords as list within
- `ShipName`, shipName enum
- `Shot`, extend coord + boolean flag of hitting a ship cell
- `BattleshipBoard`, boards contains the ships and shots as list

- `updateBoard(BattleshipBoard, x, y)`, adds a Shot of x, y coord with the hit flag, hit is true when a ship cell is hit
- `createRandomBoard(random)`, creates a board with random distrubtion of fleet, retry limit to 100 before error thrown

## [0.4.0] - 2026-11-19

### Added
- `Face`, a die face from 1 to 6
- `BidFace`, a face you can bid on, 2 to 6 (ones are wild)
- `Bid`, a quantity and a face
- `Player`, a player with id, username, dice list and connected flag
- `Reveal`, the result of a challenge, keeps every player's dice from that round
- `GameState`, the full game held by the server, includes everyone's dice
- `PublicPlayer`, a player as others see them, dice count only
- `PlayerView`, what one player is allowed to see, own dice + public info (only dice count of each player)

- `MIN_PLAYERS` (3), `STARTING_DICE` (5)
- `rollDice(count, random)`, roll some dice
- `countMatching(allDice, face)`, count dice showing the face, ones count too
- `isHigherBid(bid, previousBid)`, true if the bid raises the previous one, or if there is none
- `resolveChallenge(bid, allDice)`, true if the bid stands
- `startGame(players, random)`, every player rolls 5 dice, first player starts, throws with fewer than 3 players
- `applyBid(state, playerId, bid)`, place a bid, throws if not your turn, quantity not a positive integer, or invalid bid
- `applyChallenge(state, playerId, random)`, challenge the current bid, loser loses a die, everyone re-rolls, loser starts next round
- `removePlayer(state, playerId, random)`, a player who left is out, round restarts
- `setConnected(state, playerId, connected)`, update the connected flag only
- `viewFor(state, playerId)`, build the PlayerView for one player

## [0.5.0] - 2026-11-22

### Added
- `ClientMessage`, the messages a player sends over the socket: `auth`, `start`, `bid`, `challenge`
- `ServerMessage`, the messages the server sends back: `lobby`, `state`, `error`
- `parseClientMessage(raw)`, turn a parsed JSON value into a `ClientMessage`, throws if the shape is wrong
