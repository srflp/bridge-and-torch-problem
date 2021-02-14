export enum AlgorithmType {
  Dynamic = 'dynamic',
  Greedy = 'greedy',
  Brute = 'brute',
}

export interface Crossing {
  direction: 'left' | 'right';
  entityIds: number[];
  duration: number;
}
