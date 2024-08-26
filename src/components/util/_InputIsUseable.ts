import { INPUT_STATE } from "../../interfaces";

export function inputIsUseable(state: INPUT_STATE): boolean {
  return state === INPUT_STATE.VALID || state === INPUT_STATE.DEFAULT;
}