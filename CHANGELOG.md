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
