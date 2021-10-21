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
