import { runSolver } from '../util';

runSolver(__dirname, solve);

// -------------------------

function solvePartOne(input: string) {
  const lines = input.split('\n').map(n => parseInt(n, 10));

  for (let i = 0; i < lines.length; i++) {
    for (let j = i + 1; j < lines.length; j++) {
      const left = lines[i];
      const right = lines[j];
      const sum = left + right;

      if (sum === 2020) {
        return left * right;
      }
    }
  }

  return 'oops!';
}

// solution: 388075

function solve(input: string) {
  const lines = input.split('\n').map(n => parseInt(n, 10));

  for (let i = 0; i < lines.length; i++) {
    for (let j = i + 1; j < lines.length; j++) {
      for (let k = j + 1; k < lines.length; k++) {
        const left = lines[i];
        const mid = lines[j];
        const right = lines[k];
        const sum = left + mid + right;

        if (sum === 2020) {
          return left * mid * right;
        }
      }
    }
  }

  return 'oops!';
}

// solution: 293450526
