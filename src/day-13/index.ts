import assert from 'assert';
import { runSolver } from '../util';

// -------------------------

declare global {
  interface Array<T> {
    min(): T extends number ? T : never;
    minBy(predicate: (el: T) => number): T;
  }
}

Array.prototype.min = function () {
  if (this.length === 0) throw new Error('called min on empty array');
  return this.reduce((a, b) => Math.min(a, b));
};

Array.prototype.minBy = function <T>(predicate: (el: T) => number) {
  if (this.length === 0) throw new Error('called min on empty array');
  return this.map(el => ({
    el,
    check: predicate(el),
  })).reduce((acc, el) => (el.check < acc.check ? el : acc)).el;
};

const earliestBusAfter = (time: number) => (bus: number) => {
  let earliest = 0;
  while (earliest < time) {
    earliest += bus;
  }
  return earliest;
};

function solvePartOne(input: string) {
  const parts = input.split('\n');
  const earliest = parseInt(parts[0], 10);
  const buses = parts[1]
    .split(',')
    .map(b => parseInt(b, 10))
    .filter(n => !Number.isNaN(n));

  const predicate = earliestBusAfter(earliest);
  const resp = buses
    .map(bus => ({ bus, earliest: predicate(bus) }))
    .minBy(x => x.earliest);

  const wait = resp.earliest - earliest;
  return resp.bus * wait;
}

// solution: 8063

const isValidDeparture = (bus: number) => (time: number) => time % bus === 0;

function solve(input: string) {
  const parts = input.split('\n');
  const busesWithIndices = parts[1]
    .split(',')
    .map(b => parseInt(b, 10))
    .map((id, index) => ({ index, id }))
    .filter(({ id }) => !Number.isNaN(id))
    .sort((a, b) => b.id - a.id);

  // the bus with the highest ID will come the least frequently,
  // making it the ideal step value for our loop
  const leastFreqIndex = busesWithIndices[0].index;

  const buses = busesWithIndices.map(bus => ({
    id: bus.id,
    index: bus.index,
    offset: bus.index - leastFreqIndex,
  }));

  for (let time = 0; ; time += buses[0].id) {
    process.stdout.write(`\rchecking: ${time}`);

    if (buses.every(bus => isValidDeparture(bus.id)(time + bus.offset))) {
      const { offset } = buses.find(b => b.index === 0)!;
      return time + offset;
    }
  }

  return 'oops!';
}

// prettier-ignore
const testCases = [
  { input: '\n7,13,x,x,59,x,31,19', expected: 1068781    },
  { input: '\n17,x,13,19',          expected: 3417       },
  { input: '\n67,7,59,61',          expected: 754018     },
  { input: '\n67,x,7,59,61',        expected: 779210     },
  { input: '\n67,7,x,59,61',        expected: 1261476    },
  { input: '\n1789,37,47,1889',     expected: 1202161486 }
];

for (const testCase of testCases) {
  assert.strictEqual(solve(testCase.input), testCase.expected);
}

// -------------------------

// this algorithm is too slow to run in a reasonable amount of time :(
// I saw some people suggesting finding the LCM of the period where
// the two highest buses line up, then progressively working through
// the LCM of each subsequent bus, but I think this marks the point in
// AoC where the problems get a bit too math-heavy for me
//
// it's been a fun ride!
runSolver(__dirname, solve);
