import React, { useRef, useMemo } from 'react';

export const useDebounce = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  const callbackRef = useRef(callback);

  React.useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  return useMemo(() => {
    let timer: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>): void => {
      clearTimeout(timer);
      timer = setTimeout(() => callbackRef.current(...args), delay);
    };
  }, [callback, delay]);
};
