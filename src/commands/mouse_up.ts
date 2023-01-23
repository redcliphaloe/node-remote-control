import { mouse, up } from "@nut-tree/nut-js";

export const mouse_up = (param: number) => {
  return  mouse.move(up(param));
};
