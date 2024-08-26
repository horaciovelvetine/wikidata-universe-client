import { Vertex } from "../models";

export function clickTargetMatchesCurrentSelection(curSelected: Vertex | null, target: Vertex) {
  return curSelected != null && curSelected.id == target.id;
}