import { mouse, right } from "@nut-tree/nut-js";

export const mouse_right = (param: number) => {
  return  mouse.move(right(param));
};
