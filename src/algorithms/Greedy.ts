import { Crossing } from './types';
import Algorithm from './Algorithm';

export default class Greedy extends Algorithm {
  private readonly numberOfPeople: number;
  private readonly sequenceOfCrossings: Crossing[];

  constructor(private travellingTimes: number[], private capacity: number) {
    super();
    this.numberOfPeople = travellingTimes.length;
    this.sequenceOfCrossings = this.generateSequenceOfCrossings();
  }

  private generateSequenceOfCrossings() {
    const crossings: Crossing[] = [];
    let direction = 'right';
    let left = Array(this.travellingTimes.length).fill(true);
    let right = Array(this.travellingTimes.length).fill(false);
    while (!right.every((i) => i)) {
      if (direction === 'right') {
        let moveIndexes = [];
        let duration = 0;
        let capacityLeft = this.capacity;
        let i = 0;
        while (capacityLeft > 0 && i < this.travellingTimes.length) {
          if (left[i]) {
            left[i] = false;
            right[i] = true;
            moveIndexes.push(i);
            duration = this.travellingTimes[i];
            capacityLeft--;
          }
          i++;
        }
        crossings.push({
          direction,
          entityIds: moveIndexes,
          duration,
        });
        direction = 'left';
        continue;
      }

      if (direction === 'left') {
        let moveIndexes = [];
        let duration = 0;
        let i = 0;
        while (!moveIndexes.length && i < this.travellingTimes.length) {
          if (right[i]) {
            right[i] = false;
            left[i] = true;
            moveIndexes.push(i);
            duration = this.travellingTimes[i];
          }
          i++;
        }
        crossings.push({
          direction,
          entityIds: moveIndexes,
          duration,
        });
        direction = 'right';
      }
    }
    return crossings;
  }

  getSequenceOfCrossings(): Crossing[] {
    return this.sequenceOfCrossings;
  }

  getTotalTime(): number {
    return this.sequenceOfCrossings.reduce((sum, crossing) => sum + crossing.duration, 0);
  }

  getTravellingTimes(): number[] {
    return this.travellingTimes;
  }
}
