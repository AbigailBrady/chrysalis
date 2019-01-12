import { url } from "./settings.js";

const ws = new WebSocket(url);
if (ws) {
  ws.binaryType = "arraybuffer";
}

export function socketSend(arr) {
  if (arr.length === 0) {
    return;
  }
  ws.send(new Uint8Array(arr));
}

export function getSocket() {
  return ws;
}
