import { readFileSync } from 'fs';
import { join } from 'path';

const readFile = (path: string) => readFileSync(path, 'utf-8');

export const runSolver = (dirname: string, solver: (input: string) => any) => {
  const inputFile = join(dirname, 'input.txt');
  const input = readFile(inputFile);
  const solution = solver(input);
  console.log('solution:', solution);
};
