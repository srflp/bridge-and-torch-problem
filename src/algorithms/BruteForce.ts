import _ from 'lodash';
import Algorithm from './Algorithm';
import { Crossing } from './types';

type Transition = number[];

const replaceIdsByTimes = (times: number[], transitions: Transition[]) => {
  return transitions.map((trans) => trans.map((id) => times[id]));
};

const selectDominatingTimes = (times: number[][]) => times.map((members) => Math.max(...members));

type AnnotatedSolution = {
  transitions: Transition[];
  duration: number;
};

const transformToCrossings = (times: number[]) => (transition: Transition) => {
  const go = (where: 'left' | 'right') => (ids: Transition) => ({
    direction: where,
    entityIds: ids,
    duration: Math.max(...ids.map((id: number) => times[id])),
  });

  return transition.length == 1 ? go('left')(transition) : go('right')(transition);
};

const annotateWithTimes = (times: number[]) => (transitions: Transition[]) => {
  return {
    transitions,
    duration: _.sum(selectDominatingTimes(replaceIdsByTimes(times, transitions))),
  };
};

function selectOptimalSolution(potentialSolutions: AnnotatedSolution[]): AnnotatedSolution {
  return potentialSolutions.reduce((acc, cur) => {
    return cur.duration < acc.duration ? cur : acc;
  });
}

export default class BruteForce extends Algorithm {
  private readonly minTime: number;
  private readonly solution: Crossing[];

  constructor(private travellingTimes: number[], private capacity: number) {
    super();
    const generated = this.generateAllSolutions().map(annotateWithTimes(this.travellingTimes));

    const { transitions, duration } = selectOptimalSolution(generated);

    this.solution = transitions.map(transformToCrossings(this.travellingTimes));
    this.minTime = duration;
  }

  /**
   * Get number of steps required to generate all possible solutions.
   */
  steps(): number {
    return (this.travellingTimes.length - this.capacity) / (this.capacity - 1);
  }

  generateAllSolutions() {
    let sol = [new Sol(this.travellingTimes.map(() => true))];

    const STEPS = this.steps();
    for (let i = 0; i < STEPS; i++) sol = _.flatten(sol.map(generate(this.capacity)));

    return sol.map((el) => el.consume());
  }

  getSequenceOfCrossings(): Crossing[] {
    return this.solution;
  }

  getTotalTime(): number {
    return this.minTime;
  }

  getTravellingTimes(): number[] {
    return this.travellingTimes;
  }
}

function indicesWith<T>(array: T[], value: T): number[] {
  return array.map((el, id) => (el == value ? id : -1)).filter((el) => el > -1);
}

class Sol {
  constructor(public where: boolean[], public passes: Transition[] = []) {}

  apply(travs: number[]) {
    this.passes.push(travs);
    travs.forEach((id) => {
      this.where[id] = false;
    });
    return this;
  }

  goThereAll(howMany: number) {
    // the worst hack ever part 2
    // @ts-ignore
    const possibilities: [] = new window.Combination(indicesWith(this.where, true), howMany);
    return Array.from(possibilities, (pass) => _.cloneDeep(this).apply(pass));
  }

  comebacks(): Sol[] {
    return _(this.where)
      .map((el: boolean, id: number) => (!el ? id + 1 : undefined))
      .compact()
      .map((who: number) => {
        let tmp = _.cloneDeep(this);
        tmp.where[--who] = true;
        tmp.passes.push([who]);
        return tmp;
      })
      .flatten()
      .value();
  }

  consume() {
    let remaining = indicesWith(this.where, true);
    this.passes.push(remaining);
    return this.passes;
  }
}

const generate = (cap: number) => (s: Sol) => {
  const stepOne = _.flatten(s.goThereAll(cap)).map((el) => el.comebacks());
  return _.flatten(stepOne);
};
