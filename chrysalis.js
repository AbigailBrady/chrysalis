
import { handleTerminal } from "./terminal.js" 
import { handleTelnet } from "./telnet.js" 

const ws = new WebSocket("ws://127.0.0.1:8080");
ws.binaryType = "arraybuffer";

ws.onmessage = function(event) {
  const arr = new Uint8Array(event.data);
  arr.forEach(ch => handleTelnet(ch, handleTerminal))
}

ws.onopen = function(e) {
  console.debug(e)
}
  
ws.onclose = function(e) {
  console.debug(e)
}
 
const input = document.getElementById("input")

input.onkeypress = function(event) {
  if (event.key === "Enter") {
    console.log(input.value)

    const cmd = []
    const value = input.value.toString()

    for (let idx = 0; idx < value.length; idx += 1) {
      cmd.push(value.charCodeAt(idx))
    }

    cmd.push(10)
    cmd.push(13)

    ws.send(new Uint8Array(cmd))

    input.value = ""
  }
}

  


