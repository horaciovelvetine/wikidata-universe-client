import { eInputState } from "../../interfaces";
import { inputValueIsEmpty } from "./_InputValueIsEmpty";

export function inputStateFromValue(val: string): eInputState {
  if (inputValueIsEmpty(val)) {
    return eInputState.EMPTY;
  } else if (val.length > 0) {
    return eInputState.VALID;
  } else {
    return eInputState.INVALID;
  }
}