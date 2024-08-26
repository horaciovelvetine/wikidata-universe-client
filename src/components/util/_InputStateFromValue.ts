import { INPUT_STATE } from "../../interfaces";
import { inputValueIsEmpty } from "./_InputValueIsEmpty";

export function inputStateFromValue(val: string): INPUT_STATE {
  if (inputValueIsEmpty(val)) {
    return INPUT_STATE.EMPTY;
  } else if (val.length > 0) {
    return INPUT_STATE.VALID;
  } else {
    return INPUT_STATE.INVALID;
  }
}