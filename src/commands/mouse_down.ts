import { mouse, down } from "@nut-tree/nut-js";

export const mouse_down = (param: number) => {
  return  mouse.move(down(param));
};
