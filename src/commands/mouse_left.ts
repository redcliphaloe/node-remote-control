import { mouse, left } from "@nut-tree/nut-js";

export const mouse_left = (param: number) => {
  return  mouse.move(left(param));
};
