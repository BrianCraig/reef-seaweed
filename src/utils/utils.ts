import { BigNumber } from "ethers";
import { useState, useCallback } from "react";
import { IDORange } from "./contractTypes";
import { InformationInterface, IDOStatus } from "./types";

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

export const timestampToDate = (timestamp: BigNumber) => new Date(timestamp.toNumber() * 1000)

export const timestampToStatus = ({ startingTimestamp, endTimestamp }: InformationInterface): IDOStatus => {
  let start = startingTimestamp.toNumber();
  let end = endTimestamp.toNumber();
  let timestampNow = Math.floor(Date.now() / 1000);
  if (timestampNow < start) return IDOStatus.Pending;
  if (timestampNow < end) return IDOStatus.Open;
  return IDOStatus.Ended;
}

export const rangeToStatus = ({ start, end }: IDORange): IDOStatus => {
  let timestampNow = Math.floor(Date.now() / 1000);
  if (timestampNow < start.toNumber()) return IDOStatus.Pending;
  if (timestampNow < end.toNumber()) return IDOStatus.Open;
  return IDOStatus.Ended;
}

export const addressFormat = (address: string): string => `${address.substr(0, 5)}...${address.substr(38, 4)}`

export const zeroAddress = "0x0000000000000000000000000000000000000000"