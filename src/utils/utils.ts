import { useState, useCallback } from "react";

export const ensure = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message);
  }
};

export const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

export const useUpdate = () => {
  let [x, setX] = useState<number>(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(() => { setX(Math.random()) }, [x])
}

const gcd = (x: number, y: number) => {
  while (y) {
    var t = y;
    y = x % y;
    x = t;
  }
  return x;
}

export const ratioToMulDiv = (n: number): [number, number] => {
  const integral = Math.floor(n);
  const frac = n - integral;

  const precision = 100000;
  const gcd_ = gcd(Math.round(frac * precision), precision);

  const denominator = precision / gcd_;
  const numerator = Math.round(frac * precision) / gcd_;
  return [integral * denominator + numerator, denominator]
}

