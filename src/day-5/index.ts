import { runSolver } from '../util';

// -------------------------

interface Seat {
  row: number;
  column: number;
}

// min/max are inclusive
interface Range {
  min: number;
  max: number;
}

const enum Direction {
  FRONT = 'F',
  BACK = 'B',
  LEFT = 'L',
  RIGHT = 'R',
}

enum BisectHalf {
  LOWER,
  UPPER,
}

const ROW_SEGMENTS: Range = { min: 0, max: 127 };
const COL_SEGMENTS: Range = { min: 0, max: 7 };

const seatId = (s: Seat) => s.row * 8 + s.column;

const seatRowColumn = (s: Seat) => `${s.row}-${s.column}`;

const length = (r: Range) => r.max - r.min + 1;

// ranges are expressed inclusively, so add 1 to account for the fencepost problem
// (max - min should equal the length of the range, but it's 1 less since it's inclusive)
const midpoint = (r: Range) => length(r) / 2 + r.min;

const bisect = (r: Range, half: BisectHalf) =>
  half === BisectHalf.LOWER
    ? { ...r, max: midpoint(r) - 1 }
    : { ...r, min: midpoint(r) };

const whichHalf = (d: Direction) =>
  d === Direction.FRONT || d === Direction.LEFT
    ? BisectHalf.LOWER
    : BisectHalf.UPPER;

const isLeftRight = (d: Direction) =>
  d === Direction.LEFT || d === Direction.RIGHT;

const findSeat = (moves: string): Seat => {
  let rowSegments = ROW_SEGMENTS;
  let colSegments = COL_SEGMENTS;
  const seat = {} as Seat;

  for (let i = 0; i < moves.length; i++) {
    const direction = moves[i] as Direction;
    const half = whichHalf(direction);

    if (i === 6) {
      seat.row = half === BisectHalf.LOWER ? rowSegments.min : rowSegments.max;
    } else if (i === 9) {
      seat.column =
        half === BisectHalf.LOWER ? colSegments.min : colSegments.max;
    } else {
      if (isLeftRight(direction)) {
        colSegments = bisect(colSegments, whichHalf(direction));
      } else {
        rowSegments = bisect(rowSegments, whichHalf(direction));
      }
    }
  }

  return seat;
};

function solvePartOne(input: string) {
  return input
    .split('\n')
    .map(moves => findSeat(moves))
    .map(seat => seatId(seat))
    .reduce((a, b) => Math.max(a, b));
}

// incorrect solution: 209 (too low)
// solution: 818

function solve(input: string) {
  const seats = input
    .split('\n')
    .map(moves => findSeat(moves))
    .map(seat => seatRowColumn(seat));

  const seatSet = new Set(seats);

  let hasSeenSeat = false;
  for (let row = 0; row <= ROW_SEGMENTS.max; row++) {
    for (let column = 0; column <= COL_SEGMENTS.max; column++) {
      const seat: Seat = { row, column };
      const key = seatRowColumn(seat);

      if (seatSet.has(key)) {
        hasSeenSeat = true;
      } else if (hasSeenSeat) {
        return seatId(seat);
      }
    }
  }

  return 'seat not found!';
}

// solution: 559

// -------------------------

runSolver(__dirname, solve);
