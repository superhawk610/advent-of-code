import P from 'parsimmon';
import _ from 'lodash';
import { runSolver } from '../util';

// -------------------------

type OpCode = 'acc' | 'jmp' | 'nop';

interface Operation {
  instruction: OpCode;
  arg: number;
}

const parseOperation = (ast: any[]): Operation => ({
  instruction: ast[0],
  arg: ast[2],
});

const parseSignedInt = (ast: any[]) => (ast[0] === '-' ? -1 * ast[1] : ast[1]);

const language = P.createLanguage({
  operation: r =>
    P.seq(r.opCode, P.whitespace, r.signedInt).map(parseOperation),
  opCode: r => P.alt(P.string('acc'), P.string('jmp'), P.string('nop')),
  signedInt: r =>
    P.seq(P.alt(P.string('-'), P.string('+')), P.digits.map(Number)).map(
      parseSignedInt
    ),
});

interface VisitedOperation extends Operation {
  visited?: boolean;
}

interface Machine {
  cursor: number;
  acc: number;
  ops: VisitedOperation[];
  looped: boolean;
}

const acc = (pc: Machine, operation: Operation) => {
  pc.acc += operation.arg;
  pc.cursor += 1;
};

const jmp = (pc: Machine, operation: Operation) => {
  pc.cursor += operation.arg;
};

const nop = (pc: Machine, operation: Operation) => {
  pc.cursor += 1;
};

const tick = (pc: Machine) => {
  const op = pc.ops[pc.cursor];

  if (op.visited) {
    pc.looped = true;
    return;
  }

  op.visited = true;
  switch (op.instruction) {
    case 'acc':
      return acc(pc, op);
    case 'jmp':
      return jmp(pc, op);
    case 'nop':
      return nop(pc, op);
  }
};

function solvePartOne(input: string) {
  const lines = input.split('\n');
  const ops: Operation[] = lines.map(line => language.operation.tryParse(line));
  const pc: Machine = { cursor: 0, acc: 0, ops, looped: false };

  while (!pc.looped && pc.cursor < pc.ops.length) {
    tick(pc);
  }

  return pc.acc;
}

// solution: 1521

function solve(input: string) {
  const lines = input.split('\n');
  const ops: Operation[] = lines.map(line => language.operation.tryParse(line));

  for (let i = 0; i < ops.length; i++) {
    // we can only change nop -> jmp and jmp -> nop
    if (ops[i].instruction === 'acc') continue;

    // console.log('modding instruction at', i);

    const moddedOps = _.cloneDeep(ops);
    moddedOps[i].instruction =
      moddedOps[i].instruction === 'nop' ? 'jmp' : 'nop';

    const pc: Machine = { cursor: 0, acc: 0, ops: moddedOps, looped: false };

    while (!pc.looped && pc.cursor < pc.ops.length) {
      tick(pc);
      // console.log(pc);
    }

    if (pc.cursor === pc.ops.length) {
      return pc.acc;
    }

    // console.log('\n------\n');
  }

  return 'oops!';
}

// solution: 1016

// -------------------------

runSolver(__dirname, solve);
