import { RefObject } from "react";

/**
 * @method showHideIncompatibleScreenNotice() - toggle the visibility of the container displayed when the clients is being run on too small of a screen (for the client to function correctly)
 */

export function showHideIncompatibleScreenNotice(ref: RefObject<HTMLDivElement>, show: boolean) {
  const cont = ref.current;
  if (!cont) return;

  if (show) {
    cont.style.display = 'flex'
    setTimeout(() => {
      cont.style.opacity = '1'
    }, 1)
  } else {
    cont.style.opacity = '0';
    setTimeout(() => {
      cont.style.display = 'none'
    }, 235)
  }
}