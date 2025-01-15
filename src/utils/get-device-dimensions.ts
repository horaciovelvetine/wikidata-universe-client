import { Dimensions } from "../types";

export function getDeviceDiemnsions() {
  return new Dimensions(innerWidth, innerHeight);
}