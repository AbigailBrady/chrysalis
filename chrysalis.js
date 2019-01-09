
import { handleTerminal, appendCommand } from "./terminal.js" 
import { handleTelnet } from "./telnet.js" 

const input = document.getElementById("input")
const main = document.getElementById("main")
const output = document.getElementById("output")

const ws = new WebSocket("ws://192.168.0.31:8080");
ws.binaryType = "arraybuffer";

function setEcho(arr)
{
  if (!arr) {
	  input.type = "password";
  } else {
	  input.type = undefined;
  }
}

function socketSend(arr) {
  ws.send(new Uint8Array(arr))
}

function scrollToEnd() {
  main.scrollTop = main.scrollHeight;
}

ws.onmessage = function(event) {
  const arr = new Uint8Array(event.data);
  arr.forEach(ch => handleTelnet(ch, handleTerminal, setEcho, socketSend))
  scrollToEnd()
}

ws.onopen = function(e) {
  console.debug(e)
}
  
ws.onclose = function(e) {
  console.debug(e)
}
    
function sendCommand(value) {
    const cmd = []
    const str = value.toString()

    for (let idx = 0; idx < value.length; idx += 1) {
      cmd.push(value.charCodeAt(idx))
    }

    cmd.push(10)
    cmd.push(13)

    ws.send(new Uint8Array(cmd))
}
 
input.onkeypress = function(event) {
  if (event.key === "Enter") {
    sendCommand(input.value)
    if (input.type != "password") {
      appendCommand(input.value)
    }
    input.value = ""
  }
}

  


