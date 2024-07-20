import { DISPLAY_STATES } from "../interfaces";

export const DynamicDisplayStateMap = {
  [DISPLAY_STATES.HIDDEN]: "display-hidden",
  [DISPLAY_STATES.LOADING]: "display-loading",
  [DISPLAY_STATES.ERROR]: "display-error",
  [DISPLAY_STATES.SHOWN]: "display-shown",
  [DISPLAY_STATES.REMOVED]: "display-removed",
};