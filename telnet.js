  let telnetState = 0;

  const IAC = 255;
  const DONT = 254;
  const DO = 253;
  const WONT = 252;
  const WILL = 251;
  const SB = 250
  const NOP = 241;
  const SE = 240;

  export function handleTelnet(data, dataHandler) {

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
      dataHandler(data)
    } else {
      console.error("unknown byte", data, "in state",  telnetState)
    }
  }

