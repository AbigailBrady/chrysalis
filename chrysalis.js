  const output = document.getElementById("output")

  function handleChar(data) {
    if (data === 13) {
      output.innerHTML += "<br />";
    } else {
      let char = String.fromCharCode(data)
      if (char === " ") char = "&nbsp;"
      output.innerHTML += char;
    }
  }

  let esc = false;
  let escStr = "";
 
  const ESC = 27;  

  function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
  }

  function handleTerminal(data) {

    const str = String.fromCharCode(data)

    if (esc) {
        if (isLetter(str)) {
           esc = false;
        }
        escStr += str;
        return;
    }

    if (data === ESC) {
       esc = true;
       escStr = "";
       return;
    }

    handleChar(data);
  }

  let telnetState = 0;

  const IAC = 255;
  const DONT = 254;
  const DO = 253;
  const WONT = 252;
  const WILL = 251;
  const SB = 250
  const NOP = 241;
  const SE = 240;

  function handleTelnet(data) {

    if (telnetState === 0 && data === IAC) {
       telnetState = IAC;
       return;
    }

    if (telnetState === IAC) {
       if (data === WILL || data === WONT || data === DO ||
           data === DONT) {
          telnetState = data;
          return;
       }

       if (data === NOP) {
          telnetState = 0;
          return;
       }

       console.error("unknown byte", data, "in state",  telnetState)
       return
    }

    if (telnetState === WILL || telnetState === WONT || telnetState === DO || telnetState === DONT) {
       telnetState = 0;
       return;
    }

    if (telnetState === 0) {
      handleTerminal(data)
    } else {
       console.error("unknown byte", data, "in state",  telnetState)
    }
  }

  const ws = new WebSocket("ws://192.168.0.31:8080");
  ws.binaryType = "arraybuffer";

  ws.onmessage = function(event) {
    const arr = new Uint8Array(event.data);
    arr.forEach(handleTelnet)
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

  


