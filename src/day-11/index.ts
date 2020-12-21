import path from 'path';
import _ from 'lodash';
import { readFile, runSolver } from '../util';

const getDemoInput = (demo: number) => (round: number) =>
  readFile(path.join(__dirname, `demo-${demo}`, `round-${round}.txt`));

// -------------------------

const FLOOR = '.';
const EMPTY = 'L';
const OCCUPIED = '#';

// rules differ between part one and part two
enum Ruleset {
  ONE,
  TWO,
}

type Grid = string[][];

type Move = [number, number];

// prettier-ignore
const moves: Move[] = [
  [-1, -1], // 🡔
  [0, -1],  // 🡑
  [1, -1],  // 🡕
  [-1, 0],  // 🡐
  [1, 0],   // 🡒
  [-1, 1],  // 🡗
  [0, 1],   // 🡓
  [1, 1],   // 🡖
];

const inputToGrid = (input: string) =>
  input.split('\n').map(line => line.split(''));

const gridToInput = (grid: Grid) => grid.map(row => row.join('')).join('\n');

const inBounds = (grid: Grid, x: number, y: number) =>
  y >= 0 && y < grid.length && x >= 0 && x <= grid[y].length;

const adjacentSeats = (grid: Grid, x: number, y: number) =>
  moves
    .map(move => doMove(move, x, y))
    .filter(([x, y]) => inBounds(grid, x, y))
    .map(([x, y]) => grid[y][x]);

const doMove = ([right, down]: Move, x: number, y: number) => [
  x + right,
  y + down,
];

const canSeeAtLeastNOccupiedSeats = (
  grid: Grid,
  fromX: number,
  fromY: number,
  n: number
) => {
  let canSee = 0;
  for (const move of moves) {
    if (canSee >= n) return true;

    let [x, y] = doMove(move, fromX, fromY);
    while (inBounds(grid, x, y)) {
      if (grid[y][x] === OCCUPIED) {
        canSee += 1;
        break;
      }

      // empty chairs block line of sight
      if (grid[y][x] === EMPTY) {
        break;
      }

      [x, y] = doMove(move, x, y);
    }
  }

  return canSee >= n;
};

const runSeat = (ruleset: Ruleset, grid: Grid, x: number, y: number) => {
  if (ruleset === Ruleset.ONE) {
    return runSeatR1(grid, x, y);
  } else {
    return runSeatR2(grid, x, y);
  }
};

const runSeatR1 = (grid: Grid, x: number, y: number) => {
  const seat = grid[y][x];
  if (seat === FLOOR) return FLOOR;

  const adjacent = adjacentSeats(grid, x, y);

  if (seat === EMPTY) {
    if (!adjacent.some(s => s === OCCUPIED)) {
      return OCCUPIED;
    } else {
      return EMPTY;
    }
  }

  // ASSERT: seat is occupied
  if (adjacent.filter(s => s === OCCUPIED).length >= 4) {
    return EMPTY;
  } else {
    return OCCUPIED;
  }
};

const runSeatR2 = (grid: Grid, x: number, y: number) => {
  const seat = grid[y][x];
  if (seat === FLOOR) return FLOOR;

  if (seat === EMPTY) {
    if (!canSeeAtLeastNOccupiedSeats(grid, x, y, 1)) {
      return OCCUPIED;
    } else {
      return EMPTY;
    }
  }

  // ASSERT: seat is occupied
  if (canSeeAtLeastNOccupiedSeats(grid, x, y, 5)) {
    return EMPTY;
  } else {
    return OCCUPIED;
  }
};

const runRound = (ruleset: Ruleset, grid: Grid) => {
  const nextGrid = [];

  for (let y = 0; y < grid.length; y++) {
    const row = [];
    for (let x = 0; x < grid[y].length; x++) {
      row.push(runSeat(ruleset, grid, x, y));
    }
    nextGrid.push(row);
  }

  return nextGrid;
};

function solvePartOne(input: string) {
  const grid = inputToGrid(input);

  let prev = null;
  let next = grid;
  while (!_.isEqual(prev, next)) {
    prev = next;
    next = runRound(Ruleset.ONE, prev);
  }

  return prev?.flat().filter(s => s === OCCUPIED).length;
}

// solution: 2354

function solve(input: string) {
  const grid = inputToGrid(input);

  let prev = null;
  let next = grid;
  while (!_.isEqual(prev, next)) {
    prev = next;
    next = runRound(Ruleset.TWO, prev);
  }

  return prev?.flat().filter(s => s === OCCUPIED).length;
}

// solution: 2072

// -------------------------

runSolver(__dirname, solve);
