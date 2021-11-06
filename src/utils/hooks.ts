import { useToast } from '@chakra-ui/toast';
import React, { useCallback, useEffect, useState } from 'react';

export const useLocalStorage = <T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(value);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

// Hook
export const useAsync = <T, E = string>(
  asyncFunction: () => Promise<T>,
  immediate = true
) => {
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [value, setValue] = useState<T | undefined>(undefined);
  const [error, setError] = useState<E | undefined>(undefined);
  // The execute function wraps asyncFunction and
  // handles setting state for pending, value, and error.
  // useCallback ensures the below useEffect is not called
  // on every render, but only if asyncFunction changes.
  const execute = useCallback(() => {
    setStatus("pending");
    setValue(undefined);
    setError(undefined);
    return asyncFunction()
      .then((response: any) => {
        setValue(response);
        setStatus("success");
      })
      .catch((error: any) => {
        console.log(error);
        setError(error);
        setStatus("error");
      });
  }, [asyncFunction]);
  // Call execute if we want to fire it right away.
  // Otherwise execute can be called later, such as
  // in an onClick handler.
  useEffect(() => {
    if (immediate) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate]);
  return { execute, status, value, error };
};

export const useToggle = (initialState: boolean = false): readonly [boolean, () => void, () => void, () => void] => {
  const [state, setState] = useState<boolean>(initialState);

  const toggle = useCallback((): void => setState(state => !state), []);
  const setTrue = useCallback((): void => setState(true), []);
  const setFalse = useCallback((): void => setState(false), []);
  return [state, toggle, setTrue, setFalse] as const;
}

export const useIntervalUpdate = (miliseconds: number = 1000) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [update, setUpdate] = useState<number>(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setUpdate(Math.random());
    }, miliseconds)
    return () => clearInterval(intervalId);
  }, [setUpdate, miliseconds])
}

export const useCallbackAsync = (ex: (...params: any[]) => Promise<any>, execute: boolean, deps: React.DependencyList) => {
  useEffect(() => {
    if (execute) {
      ex();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export const useInput = (defaultValue = "") => {
  const [val, setVal] = useState<string>(defaultValue)
  const setEv = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => setVal(ev.target.value), [setVal]);
  return [val, setEv] as const
}

export const useToastCatch = <T>(
  successTitle: string,
  successText: (input: T) => string,
  setLoading: (status: boolean) => any,
  prom: () => Promise<T>
): () => Promise<T> => {
  const toast = useToast();
  let work = async () => {
    setLoading(true);
    try {
      let value = await prom()
      toast({
        title: successTitle,
        description: successText(value),
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top"
      })
      setLoading(false);
      return value;
    } catch (e) {
      toast({
        title: "An error ocurred",
        description: (e as Error).message,
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top"
      })
      setLoading(false);
      throw e;
    }
  }
  return work;
}