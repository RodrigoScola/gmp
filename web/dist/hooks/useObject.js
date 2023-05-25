import { useCallback, useState } from "react";
export function useObject(initialState) {
    const [state, setState] = useState(initialState);
    const newState = useCallback((newState) => {
        setState((state) => ({ ...state, ...newState }));
    }, []);
    return [state, newState];
}
