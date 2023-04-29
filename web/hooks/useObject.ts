import { useCallback, useState } from "react";

type UseObject<T> = [T, (newState: Partial<T>) => void];

export function useObject<T>(initialState: T): UseObject<T> {
  const [state, setState] = useState<T>(initialState);
  const newState = useCallback((newState: Partial<T>) => {
    setState((state) => ({ ...state, ...newState }));
  }, []);
  return [state, newState];
}
