export interface MinMaxSet {
  x: MinMaxData;
  y: MinMaxData;
  z: MinMaxData;
}

interface MinMaxData {
  min: number;
  max: number;
  diff: number;
}
