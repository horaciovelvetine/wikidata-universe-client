import { ReactNode, useRef } from "react";
import { useUnfocusedClickListener } from "../../hooks";

/**
 * Props for the UnfocusClickToCloseWrapper component.
 *
 * @property onOutsideClickCallback - A callback function to execute when a click outside the wrapped element is detected.
 * @property children - The child elements to be wrapped by the component.
 */
interface UnfocusedClickBoundaryProviderProps {
  unfocusedClickCallback: () => void;
  children: ReactNode;
}

/**
 * A wrapper component that detects clicks outside of its children and executes a callback function when such clicks occur.
 *
 * @param onOutsideClickCallback - A callback function to execute when a click outside the wrapped element is detected.
 * @param children - The child elements to be wrapped by the component.
 * @returns A div element wrapping the children with the outside click detection functionality.
 */
export const UnfocusedClickBoundaryProvider = ({
  unfocusedClickCallback,
  children,
}: UnfocusedClickBoundaryProviderProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useUnfocusedClickListener(ref, unfocusedClickCallback);
  return <div ref={ref}>{children}</div>;
};
