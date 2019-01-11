import "./jquery.js"

import { handleTerminal, appendCommand } from "./terminal.js" 
import { handleTelnet, sendSize, registerSocketSend } from "./telnet.js" 

import { url } from "./settings.js"

const input = document.getElementById("input")
const main = document.getElementById("main")
const measure = document.getElementById("measure")

function updateSize() {
  const fullWidth = $(wide).width()

  const width = Math.floor((fullWidth / measure.offsetWidth)) - 4
	console.log(width)
  sendSize(width)
}

window.addEventListener("resize", updateSize);

updateSize()

const ws = new WebSocket(url)
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
  if (arr.length === 0) {
	  return;
  }
  ws.send(new Uint8Array(arr))
}

registerSocketSend(socketSend)

function scrollToEnd() {
  main.scrollTop = main.scrollHeight;
}

ws.onmessage = event => {
  const arr = new Uint8Array(event.data);
  arr.forEach(ch => socketSend(handleTelnet(ch, handleTerminal, setEcho, socketSend)) )
  scrollToEnd()
}

ws.onopen = e => {
  console.debug(e)
}
  
ws.onclose = e => {
  console.debug(e)
}
    
function sendCommand(value) {
    const cmd = []

    for (let idx = 0; idx < value.length; idx += 1) {
      cmd.push(value.charCodeAt(idx))
    }

    cmd.push(10)
    cmd.push(13)

    socketSend(cmd)
}
 
input.onkeypress = event => {
  if (event.key === "Enter") {
    sendCommand(input.value)
    if (input.type !== "password") {
      appendCommand(input.value)
    }
    input.value = ""
  }
}

  


