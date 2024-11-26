import { ArrowBoth, ArrowFrom, ArrowTo } from "../../../assets/icons";
import { EDGE_DIR } from "../../models";

export function edgeDirectionIcon(direction: EDGE_DIR) {
  if (direction == EDGE_DIR.OUTGOING) return ArrowTo;
  if (direction == EDGE_DIR.INCOMING) return ArrowFrom;
  return ArrowBoth;
}
