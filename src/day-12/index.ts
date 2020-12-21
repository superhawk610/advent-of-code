import { mod, nTimes, runSolver } from '../util';

// -------------------------

enum Action {
  Move,
  Turn,
}

enum Heading {
  North = 0,
  East = 1,
  South = 2,
  West = 3,
}

type Forward = 'FORWARD';

enum Side {
  Left,
  Right,
}

interface Coordinate {
  east: number; // x
  north: number; // y
}

interface Ship {
  location: Coordinate;
  heading: Heading;
}

interface ShipP2 {
  location: Coordinate;
  // waypoint is stored as a relative offset
  // eg - `east` points to the right and `north` points
  //      up from the ship's location
  waypoint: Coordinate;
}

interface MoveInstruction {
  action: Action.Move;
  direction: Heading | Forward;
  amount: number;
}

interface TurnInstruction {
  action: Action.Turn;
  direction: Side;
  amount: number;
}

type Instruction = MoveInstruction | TurnInstruction;

const parseInstruction = (input: string): Instruction => {
  const amount = parseInt(input.slice(1), 10);

  switch (input[0]) {
    case 'N':
      return { action: Action.Move, direction: Heading.North, amount };
    case 'S':
      return { action: Action.Move, direction: Heading.South, amount };
    case 'E':
      return { action: Action.Move, direction: Heading.East, amount };
    case 'W':
      return { action: Action.Move, direction: Heading.West, amount };
    case 'L':
      return { action: Action.Turn, direction: Side.Left, amount: amount / 90 };
    case 'R':
      return {
        action: Action.Turn,
        direction: Side.Right,
        amount: amount / 90,
      };
    case 'F':
      return { action: Action.Move, direction: 'FORWARD', amount };
  }

  throw new Error(`invalid instruction: ${input}`);
};

const headingAfterTurning = (
  from: Heading,
  direction: Side,
  amount: number
) => {
  const modifier = direction === Side.Left ? -1 : 1;
  return mod((from as number) + amount * modifier, 4) as Heading;
};

const locationAfterMoving = (
  from: Coordinate,
  direction: Heading,
  amount: number
) => {
  switch (direction) {
    case Heading.North:
      return { ...from, north: from.north + amount };
    case Heading.East:
      return { ...from, east: from.east + amount };
    case Heading.South:
      return { ...from, north: from.north - amount };
    case Heading.West:
      return { ...from, east: from.east - amount };
  }
};

const runInstruction = (ship: Ship, instruction: Instruction) => {
  if (instruction.action === Action.Turn) {
    ship.heading = headingAfterTurning(
      ship.heading,
      instruction.direction,
      instruction.amount
    );
  } else {
    const direction =
      instruction.direction === 'FORWARD'
        ? ship.heading
        : instruction.direction;
    ship.location = locationAfterMoving(
      ship.location,
      direction,
      instruction.amount
    );
  }
};

const manhattanDistance = (coord: Coordinate) =>
  Math.abs(coord.east) + Math.abs(coord.north);

function solvePartOne(input: string) {
  const instructions = input.split('\n').map(parseInstruction);
  const ship: Ship = { location: { east: 0, north: 0 }, heading: Heading.East };

  for (const instruction of instructions) {
    runInstruction(ship, instruction);
  }

  return manhattanDistance(ship.location);
}

// solution: 882

const addCoordinates = (a: Coordinate, b: Coordinate) => ({
  east: a.east + b.east,
  north: a.north + b.north,
});

const rotate90CW = (point: Coordinate) => ({
  east: point.north,
  north: point.east * -1,
});

const rotate = (point: Coordinate, direction: Side, amount: number) => {
  const modifier = direction === Side.Right ? 1 : -1;
  const amountCW = mod(amount * modifier, 4);

  let rotated = { ...point };
  nTimes(amountCW)(() => {
    rotated = rotate90CW(rotated);
  });
  return rotated;
};

const runInstructionP2 = (ship: ShipP2, instruction: Instruction) => {
  if (instruction.action === Action.Turn) {
    ship.waypoint = rotate(
      ship.waypoint,
      instruction.direction,
      instruction.amount
    );
  } else if (instruction.direction === 'FORWARD') {
    nTimes(instruction.amount)(() => {
      ship.location = addCoordinates(ship.location, ship.waypoint);
    });
  } else {
    ship.waypoint = locationAfterMoving(
      ship.waypoint,
      instruction.direction,
      instruction.amount
    );
  }
};

function solve(input: string) {
  const instructions = input.split('\n').map(parseInstruction);
  const ship: ShipP2 = {
    location: { east: 0, north: 0 },
    waypoint: { east: 10, north: 1 },
  };

  for (const instruction of instructions) {
    runInstructionP2(ship, instruction);
  }

  return manhattanDistance(ship.location);
}

// incorrect solution: 42315 (too high, rotate was bugged to only ever perform 1 turn)
// solution: 28885

// -------------------------

runSolver(__dirname, solve);
