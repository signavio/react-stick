import { type PositionT, type AlignT } from "../types";

type DefaultAlignT = {
  [position in PositionT]: AlignT;
};

const defaultAligns: DefaultAlignT = {
  "top left": "bottom left",
  "top center": "bottom center",
  "top right": "bottom right",
  "middle left": "middle right",
  "middle center": "middle center",
  "middle right": "middle left",
  "bottom left": "top left",
  "bottom center": "top center",
  "bottom right": "top right",
};

const getDefaultAlign = (position: PositionT): AlignT =>
  defaultAligns[position];

export default getDefaultAlign;
