export const ensure = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message);
  }
};

export const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));
