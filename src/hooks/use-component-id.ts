import { useCallback } from "react";
/**
 * Custom hook to provides a way for each element inside a React component to share a similarly prefixed ID.
 * @function useComponentID() - 'remembers' an ID prefix for the enclosing component, providing @function ID()
 * which will return a formatted ID with useable unique ID's for each element to be styled.
 *
 * @param componentPrefix - The prefix to be used for generating the component ID.
 * @returns An object containing the `ID` function which appends a suffix to the component prefix.
 *
 * @example
 * ```typescript
 * const { ID } = useComponentID("component");
 * const uniqueID = ID("123"); //=> "component-123"
 * ```
 */

export function useComponentID(componentPrefix: string) {
  const ID = useCallback(
    (sufx: string) => `${componentPrefix}-${sufx}`,
    [componentPrefix]
  );
  return { ID };
}
