import { runSolver } from '../util';

// -------------------------

const TREE = '#';
const SNOW = '.';

function solvePartOne(input: string) {
  const lines = input.split('\n');
  const width = lines[0].length;

  // coordinates begin in the top left and increase
  // as you move down and to the right
  //
  //     0 1 2 3 4
  //     1
  //     2
  //     3   O <-- { x: 2, y: 3 }
  //     4
  //
  let pos = { x: 0, y: 0 };
  let treesHit = 0;
  while (pos.y < lines.length) {
    if (lines[pos.y][pos.x % width] === TREE) {
      treesHit++;
    }

    // move right 3, down 1
    pos.x += 3;
    pos.y += 1;
  }

  return treesHit;
}

// solution: 294

const NAVS = [
  { right: 1, down: 1 },
  { right: 3, down: 1 },
  { right: 5, down: 1 },
  { right: 7, down: 1 },
  { right: 1, down: 2 },
];

function solve(input: string) {
  const lines = input.split('\n');
  const width = lines[0].length;

  const hits = NAVS.map(({ right, down }) => {
    let pos = { x: 0, y: 0 };
    let treesHit = 0;
    while (pos.y < lines.length) {
      if (lines[pos.y][pos.x % width] === TREE) {
        treesHit++;
      }

      pos.x += right;
      pos.y += down;
    }

    return treesHit;
  });

  return hits.reduce((a, b) => a * b);
}

// solution: 5774564250

// -------------------------

runSolver(__dirname, solve);
