import { httpServer } from "./http_server/index.js";
import { mouse, Point, up, down, left, right } from "@nut-tree/nut-js";
import { WebSocketServer, WebSocket, createWebSocketStream} from "ws";

enum Ports {
  HTTP_PORT = 8181,
  WS_PORT = 8182
};
enum Commands {
  mouse_up = 'mouse_up',
  mouse_down = 'mouse_down',
  mouse_left = 'mouse_left',
  mouse_right = 'mouse_right',
  mouse_position = 'mouse_position'
};

console.log(`Start static http server on the ${Ports.HTTP_PORT} port!`);
httpServer.listen(Ports.HTTP_PORT);

const wsServer = new WebSocketServer({port: Ports.WS_PORT});

wsServer.on('connection', (ws) => {
  const duplex = createWebSocketStream(ws, { encoding: 'utf8', decodeStrings: false});

  console.log(`Start static web socket server on the ${Ports.WS_PORT} port!`);

  duplex.on('data', async (chunk) => {
    duplex.pause();
    let [command, param1, param2] = chunk.split(' ');
    const point = await mouse.getPosition();
    param1 = parseInt(param1, 10);
    param2 = parseInt(param2, 10);

    switch (command) {
      case Commands.mouse_up:
        await mouse.move(up(param1));
        duplex.resume();
        duplex.write(`${command}`);
        break;
      case Commands.mouse_down:
        await mouse.move(down(param1));
        duplex.resume();
        duplex.write(`${command}`);
        break;
      case Commands.mouse_left:
        await mouse.move(left(param1));
        duplex.resume();
        duplex.write(`${command}`);
        break;
      case Commands.mouse_right:
        await mouse.move(right(param1));
        duplex.resume();
        duplex.write(`${command}`);
        break;
      case Commands.mouse_position:
        duplex.resume();
        duplex.write(`${command} ${point.x}px,${point.y}px`);
        break;
      default:
        break;
    }
  });

  process.on('SIGINT', () => {
    console.log(`Stop static web socket server on the ${Ports.WS_PORT} port!`);
    wsServer.close();
    process.exit();
  });
});
