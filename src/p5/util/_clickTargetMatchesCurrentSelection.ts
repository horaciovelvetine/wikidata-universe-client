import { Vertex } from "../models";

export function clickTargetMaatchesCurrentSelection(curSelected: Vertex | null, target: Vertex) {
  return curSelected != null && curSelected.id == target.id;
}