import { runSolver } from '../util';

// -------------------------

const regex = /(\d+)-(\d+) ([a-z]): (.*)/;

function solvePartOne(input: string) {
  const regex = /(\d+)-(\d+) ([a-z]): (.*)/;
  const lines = input.split('\n');

  let valid = 0;
  for (const line of lines) {
    const [, minStr, maxStr, char, password] = regex.exec(line)!;
    const min = parseInt(minStr, 10);
    const max = parseInt(maxStr, 10);
    const charCount = password
      .split('')
      .reduce((acc, el) => (el === char ? acc + 1 : acc), 0);

    if (min <= charCount && charCount <= max) {
      valid++;
    }
  }

  return valid;
}

// solution: 519

function solve(input: string) {
  const lines = input.split('\n');

  let valid = 0;
  for (const line of lines) {
    const [, leftStr, rightStr, char, password] = regex.exec(line)!;
    const left = parseInt(leftStr, 10) - 1; // remember to account for 1-indexing
    const right = parseInt(rightStr, 10) - 1;

    const indices = [left, right];
    const chars = indices.map(i => password[i]);
    const count = chars.reduce((acc, el) => (el === char ? acc + 1 : acc), 0);

    if (count === 1) {
      valid++;
    }
  }

  return valid;
}

// invalid solution: 423 (not 0-indexed, duh!)
// solution: 708

// -------------------------

runSolver(__dirname, solve);
