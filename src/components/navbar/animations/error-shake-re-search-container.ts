import { RefObject } from "react";

/**
 * @method errorShakeReSearchInput() - shakes the navbar input used to re-init the clients sketch with a new search query in the case that their query returns an error (normally no result).
 */
export function errorShakeReSearchContainer(
  inputRef: RefObject<HTMLInputElement>,
  containerRef: RefObject<HTMLDivElement>
) {
  const input = inputRef.current;
  const cont = containerRef.current;
  if (input && cont) {
    input.style.transition =
      "border-color 0.82s, color 0.82s, box-shadow 0.82s, caret-color 0.82s";
    cont.style.animation =
      "horizontal-shake 0.82s cubic-bezier(.36,.07,.19,.97) both";
    input.style.borderBottomColor = "rgb(var(--danger))";
    input.style.caretColor = "rgb(var(--danger))";
    input.style.color = "rgb(var(--danger))";
    setTimeout(() => {
      cont.style.animation = "";
      input.style.borderBottomColor = "rgb(var(--font))";
      input.style.color = "rgb(var(--font))";
      input.style.caretColor = "rgb(var(--font))";
    }, 820);
  }
}
