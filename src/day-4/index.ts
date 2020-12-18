import { runSolver } from '../util';

// -------------------------

const REQUIRED_FIELDS = [
  'byr',
  'iyr',
  'eyr',
  'hgt',
  'hcl',
  'ecl',
  'pid',
  // treat `cid` as optional (since our ID doesn't have it!)
  // 'cid'
];

function solvePartOne(input: string) {
  const passports = input.split('\n\n');

  let validPassports = 0;
  for (const passport of passports) {
    const keys = passport
      .split(/[\s\n]/)
      .map(kvp => kvp.split(':'))
      .map(kv => kv[0]);

    const keySet = new Set(keys);

    if (REQUIRED_FIELDS.every(key => keySet.has(key))) {
      validPassports++;
    }
  }

  return validPassports;
}

// invalid solution: 132 (too low, forgot to include passports w/ cid)
// invalid solution: 213 (too high, forgot to exclude passports w/ cid and w/o other req. field)
// solution: 170

const VALIDATIONS: Record<string, Validation | Validation[]> = {
  byr: { type: 'int', length: 4, min: 1920, max: 2002 },
  iyr: { type: 'int', length: 4, min: 2010, max: 2020 },
  eyr: { type: 'int', length: 4, min: 2020, max: 2030 },
  hgt: [
    { type: 'int', until: /[a-z\s\n]/ },
    { type: 'string', length: 2, oneOf: ['cm', 'in'] },
    {
      type: '$validate',
      $validate: parsed => {
        console.log('running $validate');

        switch (parsed[1]) {
          case 'cm':
            return validate({ type: 'int', min: 150, max: 193 })(
              parsed[0].toString()
            );
          case 'in':
            return validate({ type: 'int', min: 59, max: 76 })(
              parsed[0].toString()
            );
        }

        throw new Error('unreachable');
      },
    },
  ],
  hcl: [
    { type: 'string', length: 1, exactly: '#' },
    { type: 'string', length: 6, match: /[0-9a-f]/ },
  ],
  ecl: {
    type: 'string',
    length: 3,
    oneOf: ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'],
  },
  pid: { type: 'int', length: 9 },
  // cid: whatever
};

interface Validation {
  type: 'int' | 'string' | '$validate';

  // parsing hints
  length?: number;
  until?: RegExp;

  // validations
  min?: number;
  max?: number;
  oneOf?: any[];
  exactly?: any;
  match?: RegExp;
  $validate?: (parsed: any[]) => boolean;
}

interface Context {
  input: string;
  cursor: number;
}

const arrayWrap = <T>(v: T | T[]): T[] => {
  if (Array.isArray(v)) return v;
  return [v];
};

const parseUntil = (ctx: Context) => (predicate: (char: string) => boolean) => {
  const start = ctx.cursor;

  while (ctx.cursor < ctx.input.length && !predicate(ctx.input[ctx.cursor])) {
    ctx.cursor++;
  }

  return ctx.input.slice(start, ctx.cursor);
};

// TODO: input should also accept number?
const validate = (validationOrValidations: Validation | Validation[]) => (
  input: string
) => {
  const validations = arrayWrap(validationOrValidations);
  const parts = [];
  const ctx: Context = { input, cursor: 0 };

  console.log('validating', input, 'against', validations);

  for (const validation of validations) {
    switch (validation.type) {
      case 'int': {
        let parse;

        if (validation.length) {
          if (ctx.cursor + validation.length > ctx.input.length) {
            return false;
          }

          parse = ctx.input.slice(ctx.cursor, ctx.cursor + validation.length);
          ctx.cursor += validation.length;
        } else if (validation.until) {
          // TODO: validation.until shouldn't have to explicitly specify space/newline
          parse = parseUntil(ctx)(c => !!c.match(validation.until!));
        } else {
          parse = parseUntil(ctx)(c => [' ', '\n'].includes(c));
        }

        const value = parseInt(parse, 10);

        if (Number.isNaN(value)) {
          return false;
        }

        if (validation.min && value < validation.min) {
          return false;
        }

        if (validation.max && value > validation.max) {
          return false;
        }

        parts.push(value);
        break;
      }
      case 'string': {
        let parse;

        if (validation.length) {
          if (ctx.cursor + validation.length > ctx.input.length) {
            return false;
          }

          parse = ctx.input.slice(ctx.cursor, ctx.cursor + validation.length);
          ctx.cursor += validation.length;
        } else if (validation.until) {
          parse = parseUntil(ctx)(c => !!c.match(validation.until!));
        } else {
          parse = parseUntil(ctx)(c => [' ', '\n'].includes(c));
        }

        const value = parse;

        if (validation.exactly && value !== validation.exactly) {
          return false;
        }

        if (validation.oneOf && !validation.oneOf.includes(value)) {
          return false;
        }

        if (
          validation.match &&
          !value.split('').every(c => c.match(validation.match!))
        ) {
          return false;
        }

        parts.push(value);
        break;
      }
      case '$validate': {
        if (!validation.$validate) {
          throw new Error('invalid config');
        }

        if (!validation.$validate(parts)) {
          return false;
        }

        break;
      }
    }
  }

  if (ctx.cursor < ctx.input.length) {
    return false;
  }

  console.log('OK!', parts);

  return true;
};

function solve(input: string) {
  const passports = input.split('\n\n');

  let validPassports = 0;
  for (const passport of passports) {
    const valueMap = passport
      .split(/[\s\n]/)
      .map(kvp => kvp.split(':'))
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);

    const isValid = Object.entries(VALIDATIONS).every(
      ([field, validations]) =>
        valueMap[field] && validate(validations)(valueMap[field])
    );

    if (isValid) {
      validPassports++;
    }
  }

  return validPassports;
}

// incorrect solution: 106 (too high, allowed inputs w/ less than length chars)
// incorrect solution: 104 (still too high, allowed inputs with extra chars on end)
// solution: 103

// -------------------------

runSolver(__dirname, solve);
