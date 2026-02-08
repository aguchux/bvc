// Production-ready Redux hooks with TypeScript support
// Provides typed versions of dispatch/selector hooks and utility hooks

import { useDispatch, useSelector, useStore } from "react-redux";
import { useCallback, useMemo } from "react";

import type { TypedUseSelectorHook } from "react-redux";
import type { AppDispatch, RootState, AppThunk } from "store/store";
/**
 * Typed dispatch hook - use this instead of plain useDispatch
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Typed selector hook - use this instead of plain useSelector
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Typed store hook - provides access to the full store
 */
export const useAppStore = () => useStore<RootState>();

/**
 * Thunk dispatch hook - for dispatching async thunks
 */
export const useAppThunk = () => {
  const dispatch = useAppDispatch();
  return useCallback((thunk: AppThunk) => dispatch(thunk), [dispatch]);
};

/**
 * Memoized selector hook - creates a memoized selector with dependencies
 * Useful for computed/derived state
 */
export function useMemoizedSelector<T>(
  selector: (state: RootState) => T,
  deps: React.DependencyList = [],
): T {
  const memoizedSelector = useMemo(() => selector, deps);
  return useAppSelector(memoizedSelector);
}

/**
 * Action dispatcher hook - creates a stable callback for dispatching an action
 * Useful for passing dispatch callbacks to child components
 */
export function useActionDispatch<T extends (...args: any[]) => any>(
  actionCreator: T,
): (...args: Parameters<T>) => void {
  const dispatch = useAppDispatch();
  return useCallback(
    (...args: Parameters<T>) => dispatch(actionCreator(...args)),
    [dispatch, actionCreator],
  );
}
