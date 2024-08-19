import { eInputState } from "../../interfaces";

export function inputIsUseable(state: eInputState): boolean {
  return state === eInputState.VALID || state === eInputState.DEFAULT;
}