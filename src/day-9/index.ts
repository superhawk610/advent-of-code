import { runSolver } from '../util';

// -------------------------

function valid(check: number, options: number[]): boolean {
  for (let i = 0; i < options.length; i++) {
    for (let j = i; j < options.length; j++) {
      if (options[i] + options[j] === check) {
        return true;
      }
    }
  }

  return false;
}

function solvePartOne(input: string) {
  const preamble = 25;
  const numbers = input.split('\n').map(line => parseInt(line, 10));

  for (let cursor = preamble; cursor < numbers.length; cursor++) {
    if (!valid(numbers[cursor], numbers.slice(cursor - preamble, cursor))) {
      return numbers[cursor];
    }
  }

  return 'oops!';
}

// incorrect solution: 37 (wrong preamble length, duh!)
// solution: 731031916

function solve(input: string) {
  const invalidEntry = solvePartOne(input);
  const numbers = input.split('\n').map(line => parseInt(line, 10));

  for (let i = 0; i < numbers.length; i++) {
    let sum = numbers[i];
    for (let j = i + 1; j < numbers.length; j++) {
      sum += numbers[j];

      if (sum === invalidEntry) {
        const sorted = numbers.slice(i, j + 1).sort((a, b) => a - b);
        const smallest = sorted[0];
        const largest = sorted[sorted.length - 1];
        return smallest + largest;
      }

      if (sum > invalidEntry) {
        break;
      }
    }
  }

  return 'oops!';
}

// solution: 93396727

// -------------------------

runSolver(__dirname, solve);
