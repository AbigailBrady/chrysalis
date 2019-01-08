
  import { handleTerminal } from "./terminal.js" 
  import { handleTelnet } from "./telnet.js" 

  const ws = new WebSocket("ws://192.168.0.31:8080");
  ws.binaryType = "arraybuffer";

  ws.onmessage = function(event) {
    const arr = new Uint8Array(event.data);
    arr.forEach(ch => handleTelnet(ch, handleTerminal))
  }

  ws.onopen = function(_) {
  }
  
  ws.onclose = function(_) {
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

  


