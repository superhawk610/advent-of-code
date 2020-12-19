import { runSolver } from '../util';

// -------------------------

function solvePartOne(input: string) {
  const groups = input.split('\n\n');

  let answeredQuestions = 0;
  for (const group of groups) {
    const chars = group
      .split('\n')
      .map(line => line.split(''))
      .flat();
    const charSet = new Set(chars);

    answeredQuestions += charSet.size;
  }

  return answeredQuestions;
}

// solution: 6416

function allInCommon<T>(groups: T[][]): Set<T> {
  if (groups.length === 0) return new Set();

  const acc = new Set(groups[0]);
  for (let i = 1; i < groups.length; i++) {
    const group = groups[i];
    const groupSet = new Set(group);

    for (const element of acc) {
      if (!groupSet.has(element)) {
        acc.delete(element);
      }
    }
  }

  return acc;
}

function solve(input: string) {
  const groups = input.split('\n\n');

  let answeredQuestions = 0;
  for (const group of groups) {
    const cards = group.split('\n').map(line => line.split(''));

    const answers = allInCommon(cards);
    answeredQuestions += answers.size;
  }

  return answeredQuestions;
}

// solution: 3050

// -------------------------

runSolver(__dirname, solve);
