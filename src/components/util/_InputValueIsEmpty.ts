/**
 * Checks if the input value is "empty": 
 *  - only spaces 
 *  - only special chars
 *  - null || undefined.
 * 
 * @param val - The input value to check.
 * @returns A boolean indicating whether the input value is empty or not.
 */
export function inputValueIsEmpty(val: string): boolean {
  return val === '' || val === undefined || val === null || val === ' ' || /^\s*$/.test(val);
}