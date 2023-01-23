import { httpServer } from "./http_server/index.js";
import { mouse, up, down, left, right } from "@nut-tree/nut-js";
import { WebSocketServer, WebSocket, createWebSocketStream} from "ws";
import { Commands } from "./commands/model";
import { mouse_position } from "./commands/mouse_position";
import { mouse_up } from "./commands/mouse_up";
import { mouse_down } from "./commands/mouse_down";
import { mouse_left } from "./commands/mouse_left";
import { mouse_right } from "./commands/mouse_right";

enum Ports {
  HTTP_PORT = 8181,
  WS_PORT = 8182
};

console.log(`Start static http server on the ${Ports.HTTP_PORT} port!`);
httpServer.listen(Ports.HTTP_PORT);

const wsServer = new WebSocketServer({port: Ports.WS_PORT});

wsServer.on('connection', (ws) => {
  const duplex = createWebSocketStream(ws, { encoding: 'utf8', decodeStrings: false});

  console.log(`Start static web socket server on the ${Ports.WS_PORT} port!`);

  duplex.on('data', async (chunk) => {
    let [command, param1, param2] = chunk.split(' ');
    const point = await mouse_position();
    param1 = parseInt(param1, 10);
    param2 = parseInt(param2, 10);

    switch (command) {
      case Commands.mouse_up:
        await mouse_up(param1);
        duplex.write(`${command}`);
        break;
      case Commands.mouse_down:
        await mouse_down(param1);
        duplex.write(`${command}`);
        break;
      case Commands.mouse_left:
        await mouse_left(param1);
        duplex.write(`${command}`);
        break;
      case Commands.mouse_right:
        await mouse_right(param1);
        duplex.write(`${command}`);
        break;
      case Commands.mouse_position:
        duplex.write(`${command} ${point.x}px,${point.y}px`);
        break;
      default:
        duplex.write('Other commands not implemented');
        break;
    }
  });

  process.on('SIGINT', () => {
    console.log(`Stop static web socket server on the ${Ports.WS_PORT} port!`);
    wsServer.close();
    process.exit();
  });
});
