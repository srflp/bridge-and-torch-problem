import { createMultiDimensionalArray, range } from './utils';
import { Crossing } from './types';
import Algorithm from './Algorithm';

// source: https://www.sciencedirect.com/science/article/pii/S0167642315000118
export default class DynamicProgramming extends Algorithm {
  private readonly numberOfPeople: number;
  private readonly maxNoPureTrips: number;
  private readonly m: number[][];
  private readonly nomads: number[][];

  constructor(private travellingTimes: number[], private capacity: number) {
    super();
    this.numberOfPeople = travellingTimes.length;
    this.maxNoPureTrips = Math.floor((this.numberOfPeople - 2) / capacity);

    this.m = createMultiDimensionalArray(this.numberOfPeople, this.maxNoPureTrips + 1);
    this.nomads = createMultiDimensionalArray(this.numberOfPeople, this.maxNoPureTrips + 1);

    this.findOptimalSolution();
  }

  /*
   We divide the forward trips into “pure”, “nomadic” and “mixed”.
   A pure trip is a trip in which everyone is a settler.
   A nomadic trip is a trip in which everyone is a nomad.
   A mixed trip is a trip that is neither pure nor nomadic (that is, a trip that involves both settlers and nomads).
   A full trip is a trip that has C elements and a non-full trip is one that has less than C elements.
  */
  private cost(i0: number, j0: number): number {
    let t = this.travellingTimes[j0 - 1];
    for (let i = 1; i <= i0; i++) {
      t += this.travellingTimes[i - 1];
    }
    return t;
  }

  // calculate optimal travel time
  private findOptimalSolution(): void {
    // At most C people
    // excess equals 0
    for (let n = 2; n <= this.capacity; n++) {
      this.m[n - 1][0] = this.cost(0, n);
      this.nomads[n - 1][0] = 0;
    }

    // console.log('Step 2: excess > 0');
    /*
     m[n-1][e] is optimal time for n people to cross with excess e
     thus m[n-1][e] = s(n,e)
     where the function s is as defined in the paper
     nmds[n-1][e] is the number of nomads in the trip with lead n
     in an optimal solution to n people crossing with excess e
    */
    for (let n = 2; n <= this.capacity; n++) {
      for (let e = 1; e <= this.maxNoPureTrips; e++) {
        let i = Math.min(e + 1, n);
        let min = this.cost(i, n) + this.m[i - 1][e - i + 1];
        this.nomads[n - 1][e] = i;
        i--;
        while (2 <= i) {
          let temp = this.cost(i, n) + this.m[i - 1][e - i + 1];
          if (temp < min) {
            min = temp;
            this.nomads[n - 1][e] = i;
          }
          i--;
        }
        this.m[n - 1][e] = min;
      }
    }

    // n > C
    // n == C+1
    for (let e = 0; e <= this.maxNoPureTrips; e++) {
      /* no pure trip: mixed trip with at least one nomad */
      let min = this.cost(1, this.capacity + 1) + this.m[1][e];
      this.nomads[this.capacity][e] = 1;
      let temp, i;
      i = 2;
      while (i <= Math.min(e + 1, this.capacity - 1)) {
        temp = this.cost(i, this.capacity + 1) + this.m[i][e - i + 1];
        if (temp < min) {
          min = temp;
          this.nomads[this.capacity][e] = i;
        }
        i++;
      }
      this.m[this.capacity][e] = min;
    }

    // n > C+1
    for (let n = this.capacity + 2; n <= this.numberOfPeople; n++) {
      const maxExcess = Math.floor((this.numberOfPeople - n) / this.capacity);
      for (let e = 0; e <= maxExcess; e++) {
        let min = this.cost(0, n) + this.m[n - this.capacity - 1][e + 1];
        this.nomads[n - 1][e] = 0;
        let temp;
        for (let i = 1; i <= Math.min(e + 1, this.capacity - 1); i++) {
          temp = this.cost(i, n) + this.m[n - (this.capacity - i) - 1][e - i + 1];
          if (temp < min) {
            min = temp;
            this.nomads[n - 1][e] = i;
          }
        }
        this.m[n - 1][e] = min;
      }
    }
  }

  getTotalTime(): number {
    return this.m[this.numberOfPeople - 1][0];
  }

  getSequenceOfCrossings(): Crossing[] {
    const sequenceOfCrossings: Crossing[] = [];
    const leadPureTrips = [...Array(this.maxNoPureTrips)]; // stack of pure trips waiting to be scheduled
    let p = 0; // stack index
    let pureTrips = 0; // counts total number of pure trips

    let n = this.numberOfPeople;
    let e = 0;

    while (n > this.capacity) {
      let i = this.nomads[n - 1][e];
      if (i == 0) {
        /* stack pure trip with lead n*/
        leadPureTrips[p] = n;
        p++;
        pureTrips++;
        n = n - this.capacity;
        e++;
      } else {
        // console.log(`Forward Trip: nomads 1..${i}; settlers ${n - (this.capacity - i) + 1}..${n}`);
        sequenceOfCrossings.push({
          direction: 'right',
          entityIds: [...range(0, i), ...range(n - (this.capacity - i), n)],
          duration: this.travellingTimes[n - 1],
        });
        e = e - (i - 1);
        n = n - (this.capacity - i);
        // console.log(`Return Trip: nomad ${i}`);
        sequenceOfCrossings.push({
          direction: 'left',
          entityIds: [i - 1],
          duration: this.travellingTimes[i - 1],
        });
        i--;
        /* unstack and schedule pure trips */
        while (i > 0) {
          // console.log(
          //   `Forward Trip: settlers ${leadPureTrips[p - 1] - this.capacity + 1}..${
          //     leadPureTrips[p - 1]
          //   }`,
          // );
          sequenceOfCrossings.push({
            direction: 'right',
            entityIds: range(leadPureTrips[p - 1] - this.capacity, leadPureTrips[p - 1]),
            duration: this.travellingTimes[leadPureTrips[p - 1] - 1],
          });
          p--;
          // console.log(`Return Trip: nomad ${i}`);
          sequenceOfCrossings.push({
            direction: 'left',
            entityIds: [i - 1],
            duration: this.travellingTimes[i - 1],
          });
          i--;
        }
      }
    }
    while (n !== 0) {
      let i = this.nomads[n - 1][e];
      // console.log(`Forward Trip: 1..${n}`);
      sequenceOfCrossings.push({
        direction: 'right',
        entityIds: range(0, n),
        duration: this.travellingTimes[n - 1],
      });
      n = i;
      if (i > 0) {
        e = e - i + 1;
        // console.log(`Return Trip: nomad ${i}`);
        sequenceOfCrossings.push({
          direction: 'left',
          entityIds: [i - 1],
          duration: this.travellingTimes[i - 1],
        });
        i--;
        // unstack and schedule pure trips
        while (i > 0) {
          // console.log(
          //   `Forward Trip: settlers ${leadPureTrips[p - 1] - this.capacity + 1}..${
          //     leadPureTrips[p - 1]
          //   }`,
          // );
          sequenceOfCrossings.push({
            direction: 'right',
            entityIds: range(leadPureTrips[p - 1] - this.capacity, leadPureTrips[p - 1]),
            duration: this.travellingTimes[leadPureTrips[p - 1] - 1],
          });
          p--;
          // console.log(`Return Trip: nomad ${i}`);
          sequenceOfCrossings.push({
            direction: 'left',
            entityIds: [i - 1],
            duration: this.travellingTimes[i - 1],
          });
          i--;
        }
      }
    }
    return sequenceOfCrossings;
  }

  getTravellingTimes() {
    return this.travellingTimes;
  }
}
