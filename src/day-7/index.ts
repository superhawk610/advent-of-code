import P from 'parsimmon';
import _ from 'lodash';
import { runSolver } from '../util';

// -------------------------

type Bag = string; // ex - shiny gold

interface BagConstraint {
  count: number;
  type: Bag;
}

interface Rule {
  type: Bag;
  constraints: BagConstraint[];
}

const parseRule = (ast: any[]): Rule =>
  Array.isArray(ast[4])
    ? { type: ast[0], constraints: ast[4] }
    : { type: ast[0], constraints: [] };

const parseBag = (ast: any[]): Bag => ast[0] + ' ' + ast[2];

const parseBagConstraint = (ast: any[]): BagConstraint => ({
  count: ast[0],
  type: ast[2],
});

const language = P.createLanguage({
  rule: r =>
    P.seq(
      r.bag,
      P.whitespace,
      P.string('contain'),
      P.whitespace,
      P.alt(r.commaSeparatedList, P.string('no other bags')),
      P.string('.')
    ).map(parseRule),
  commaSeparatedList: r => r.bagConstraint.sepBy1(P.string(', ')),
  bag: r =>
    P.seq(
      P.letters,
      P.whitespace,
      P.letters,
      P.whitespace,
      P.string('bag'),
      P.string('s').times(0, 1)
    ).map(parseBag),
  bagConstraint: r =>
    P.seq(P.digits.map(Number), P.whitespace, r.bag).map(parseBagConstraint),
});

function allowedContainers(bag: Bag, mapping: Record<string, Set<string>>) {
  if (!mapping[bag] || mapping[bag].size === 0) return new Set();

  const bags = new Set();

  for (const parent of mapping[bag]) {
    bags.add(parent);
    for (const container of allowedContainers(parent, mapping)) {
      bags.add(container);
    }
  }

  return bags;
}

function solvePartOne(input: string) {
  const have: Bag = 'shiny gold';
  const lines = input.split('\n');
  const rules: Rule[] = lines.map(line => language.rule.tryParse(line));

  const mapping: Record<string, Set<string>> = {};
  for (const rule of rules) {
    for (const constraint of rule.constraints) {
      if (!mapping[constraint.type]) {
        mapping[constraint.type] = new Set();
      }

      mapping[constraint.type].add(rule.type);
    }
  }

  return allowedContainers(have, mapping).size;
}

// solution: 370

function bagCapacity(bag: Bag, mapping: Record<string, Rule>) {
  const rule = mapping[bag];
  let capacity = 0;

  for (const constraint of rule.constraints) {
    capacity += constraint.count;
    capacity += constraint.count * bagCapacity(constraint.type, mapping);
  }

  return capacity;
}

function solve(input: string) {
  const have: Bag = 'shiny gold';
  const lines = input.split('\n');
  const rules: Rule[] = lines.map(line => language.rule.tryParse(line));
  const mapping = _.keyBy(rules, 'type');

  return bagCapacity(have, mapping);
}

// solution: 29547

// -------------------------

runSolver(__dirname, solve);
