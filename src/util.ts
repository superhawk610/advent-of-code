import { readFileSync } from 'fs';
import { join } from 'path';

export const readFile = (path: string) => readFileSync(path, 'utf-8');

export const runSolver = (
  dirname: string,
  solver: (input: string) => any,
  filename = 'input.txt'
) => {
  const inputFile = join(dirname, filename);
  const input = readFile(inputFile);
  const solution = solver(input);
  console.log('solution:', solution);
};

// JS's % operator doesn't wrap around for negative
// numbers, so we use this workaround
export const mod = (m: number, n: number) => ((m % n) + n) % n;

export const nTimes = (n: number) => (fn: () => any) => {
  for (let i = 0; i < n; i++) {
    fn();
  }
};
