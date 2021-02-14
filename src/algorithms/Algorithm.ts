import { Crossing } from './types';

export default abstract class Algorithm {
  abstract getSequenceOfCrossings(): Crossing[];
  abstract getTotalTime(): number;
  abstract getTravellingTimes(): number[];
}
