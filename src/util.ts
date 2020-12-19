import { readFileSync } from 'fs';
import { join } from 'path';

const readFile = (path: string) => readFileSync(path, 'utf-8');

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
