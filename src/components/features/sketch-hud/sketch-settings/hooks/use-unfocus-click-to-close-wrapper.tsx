import { ReactNode, RefObject, useEffect, useRef } from "react";

function useUnfocusClickToCloseListener(ref: RefObject<HTMLDivElement>, handleClickCallback: () => void) {
  useEffect(() => {
    const handleLayoutFocusClickCheck = (e: MouseEvent) => {
      const tgt = e.target as Node;
      if (ref.current && !ref.current.contains(tgt)) {
        handleClickCallback()
      }
    }
    document.addEventListener('mousedown', handleLayoutFocusClickCheck)
    return () => {
      document.removeEventListener('mousedown', handleLayoutFocusClickCheck)
    }
  }, [ref, handleClickCallback])
}

interface UnfocusClickToCloseListenerProps {
  onOutsideClickCallback: () => void;
  children: ReactNode;
}

export const UnfocusClickToCloseWrapper = ({ onOutsideClickCallback, children }: UnfocusClickToCloseListenerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useUnfocusClickToCloseListener(ref, onOutsideClickCallback);
  return <div ref={ref}> {children} </div>;
}