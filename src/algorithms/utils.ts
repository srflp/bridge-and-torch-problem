export const createMultiDimensionalArray = <T>(n: number, m: number, initialVal?: T): T[][] => {
  const matrix = [...Array(n)].map(() => [...Array(m)]);
  return initialVal === undefined ? matrix : matrix.map((r) => r.map(() => initialVal));
};
