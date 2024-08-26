import { ArrowBoth, ArrowFrom, ArrowTo } from "../../assets/icons";
import { EDGE_TYPE } from "../_EdgeDetails";

export function edgeDirectionIcon(type: EDGE_TYPE) {
  if (type == EDGE_TYPE.TO) return ArrowTo;
  if (type == EDGE_TYPE.FROM) return ArrowFrom;
  return ArrowBoth;
}