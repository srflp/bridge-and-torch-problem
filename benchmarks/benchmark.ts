import Greedy from '../src/algorithms/Greedy';
import { random } from 'lodash';
import BruteForce from '../src/algorithms/BruteForce';
import DynamicProgramming from '../src/algorithms/DynamicProgramming';
import Algorithm from '../src/algorithms/Algorithm';
import { performance } from 'perf_hooks';

interface Data {
  capacity: number;
  travellingTimes: number[];
  time: number;
}

const capacity = 2;
const dataset: Data[] = [];
for (let i = 3; i <= 10000; i += 10) {
  const arr = Array(i)
    .fill(undefined)
    .map(() => random(1, 100000));
  arr.sort((a, b) => a - b);
  dataset.push({
    capacity: 2,
    travellingTimes: arr,
    time: -1,
  });
}

function measureTime(name: string, data: Data, cb: () => Algorithm) {
  const t0 = performance.now();
  cb();
  const t1 = performance.now();
  return Math.round((t1 - t0) * 1000) / 1000;
}
console.log('dynamic greedy brute');
new DynamicProgramming([1, 2, 3, 4], 2);
new Greedy([1, 2, 3, 4], 2);
new BruteForce([1, 2, 3, 4], 2);
for (let data of dataset) {
  const dynamic = measureTime(
    'DynamicProgramming',
    data,
    () => new DynamicProgramming(data.travellingTimes, data.capacity),
  );
  const greedy = measureTime('Greedy', data, () => new Greedy(data.travellingTimes, data.capacity));
  // const brute = measureTime(
  //   'BruteForce',
  //   data,
  //   () => new BruteForce(data.travellingTimes, data.capacity),
  // );

  console.log(dynamic, greedy);
}
