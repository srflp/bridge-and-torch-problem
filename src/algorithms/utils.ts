export const createMultiDimensionalArray = <T>(n: number, m: number, initialVal?: T): T[][] => {
  const matrix = [...Array(n)].map(() => [...Array(m)]);
  return initialVal === undefined ? matrix : matrix.map((r) => r.map(() => initialVal));
};

export const range = (start: number, stop: number, step: number = 1) =>
  Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

function combo(a: any[], min: number, max: number) {
  min = min || 1;
  max = max < a.length ? max : a.length;
  var fn = (n: number, src: any[], got: any[], all: any[]) => {
    if (n == 0) {
      if (got.length > 0) {
        all[all.length] = got;
      }
      return;
    }
    for (var j = 0; j < src.length; j++) {
      fn(n - 1, src.slice(j + 1), got.concat([src[j]]), all);
    }
    return;
  };
  var all: any[] = [];
  for (var i = min; i < a.length; i++) {
    fn(i, a, [], all);
  }
  return all.filter((el) => el.length == max);
}

export function combinations<T>(arr: T[], ofElements: number): T[][] {
  return combo(arr, ofElements, ofElements);
}

export const applyTimes = (travellers: number, capacity: number) => (callback: Function) => {
  for (let i = 0; i < (travellers - capacity) / (capacity - 1); i++) callback();
};
