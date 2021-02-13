export const createMultiDimensionalArray = <T>(n: number, m: number, initialVal?: T): T[][] => {
  const matrix = [...Array(n)].map(() => [...Array(m)]);
  return initialVal === undefined ? matrix : matrix.map((r) => r.map(() => initialVal));
};

export const range = (start: number, stop: number, step: number = 1) =>
  Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);
