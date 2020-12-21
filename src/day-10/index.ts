import { runSolver } from '../util';

// -------------------------

const parseAdapters = (input: string) => {
  const adapters = input
    .split('\n')
    .map(line => parseInt(line, 10))
    .sort((a, b) => a - b);

  // account for wall charger (effective joltage of 0)
  adapters.unshift(0);

  // account for phone joltage adapter (highest + 3)
  adapters.push(adapters[adapters.length - 1] + 3);

  return adapters;
};

function solvePartOne(input: string) {
  const adapters = parseAdapters(input);

  const diffs: Record<number, number> = {};
  for (let i = 0; i < adapters.length - 1; i++) {
    const current = adapters[i];
    const next = adapters[i + 1];
    const diff = next - current;

    diffs[diff] = (diffs[diff] || 0) + 1;
  }

  return diffs[1] * diffs[3];
}

// solution: 2100

const isValidFollower = (from: number, to: number) => to - from <= 3;

function solve(input: string) {
  const adapters = parseAdapters(input);

  // what adapters are valid to follow each adapter?
  const links: Map<number, number[]> = new Map();
  for (let i = 0; i < adapters.length; i++) {
    const followers = [];

    for (let j = i + 1; j < adapters.length; j++) {
      if (!isValidFollower(adapters[i], adapters[j])) break;

      followers.push(adapters[j]);
    }

    links.set(adapters[i], followers);
  }

  // how many possible endings exist for a chain starting at each value
  const cache: Map<number, number> = new Map();
  for (const [from, to] of Array.from(links).reverse()) {
    if (to.length === 0) {
      cache.set(from, 1);
    } else {
      cache.set(
        from,
        to.map(n => cache.get(n)!).reduce((a, b) => a + b)
      );
    }
  }

  return cache.get(adapters[0]);
}

/*

a link map lists all the valid followers for a given value

    {
      1 => [2, 3, 4],
      2 => [3, 4],
      3 => [4],
      4 => []
    }

the highest value should always correspond to an empty array, since
it has no valid followers; to determine the number of possible
permutations at any step in the link map, use this algorithm:

- if the array is empty, there's 1 possible permutation (the single adapter)
- otherwise, add the # of possible perm. for each valid follower

    // only one possible permutation (4)
    {
      4 => []
    }

    // still only one possible permutation (3 4)
    {
      3 => [4],
      4 => []
    }

    // now there's two, since 3 and 4 both have 1 possible perm
    // 2 3 4
    // 2 4
    {
      2 => [3, 4],
      3 => [4],
      4 => []
    }

    // now there's 4, since 2 has 2 and 3/4 each have 1 (2 + 1 + 1)
    // 1 2 3 4
    // 1 2 4
    // 1 3 4
    // 1 4
    {
      1 => [2, 3, 4],
      2 => [3, 4],
      3 => [4],
      4 => []
    }

*/

// incorrect solution: 9256148959232 (too low, forgot to account for variation in phone/outlet)
// solution: 16198260678656

// -------------------------

runSolver(__dirname, solve);
