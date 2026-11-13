export type ShipName = 'carrier' | 'battleship' | 'cruiser' | 'submarine' | 'destroyer';

// x - col, y - row
export interface Coordinate {
    x: number;
    y: number;
}

export interface Ship {
    name: ShipName;
    cells: Coordinate[];
}

export interface Shot extends Coordinate {
    hit: boolean;
}

export interface BattleshipBoard {
    ships: Ship[];
    shots: Shot[];
}