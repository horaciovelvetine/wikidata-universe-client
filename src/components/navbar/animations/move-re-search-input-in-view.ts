import { RefObject } from "react";

/**
 * @method moveReSearchInputInView() - coordinates the vertical transformation of the input into the clients view when a sketch becomes active on screen.
 */
export function moveReSearchInputInView(ref: RefObject<HTMLDivElement>) {
  const ele = ref.current;
  if (ele) {
    ele.style.transform = "translateY(0%)";
  }
}
