  let telnetState = 0;
  let subMode = 0;
  let subData = [];

  const IAC = 255;
  const DONT = 254;
  const DO = 253;
  const WONT = 252;
  const WILL = 251;
  const SB = 250
  const NOP = 241;
  const SE = 240;

  const ECHO = 1;
  const TTYPE = 24;

  const SEND = 1;
  const IS = 0;

  function handleNegotiation(state, code, echoHandler, telnetSend) {

	 if (state === WILL && code === ECHO) {
		 telnetSend([IAC, DO, ECHO])
		 echoHandler(false)
		 return
	 }
	 if (state === WONT && code === ECHO) {
		 telnetSend([IAC, DONT, ECHO])
		 echoHandler(true)
		 return
	 }
	 if (state === DO && code === TTYPE) {
		 telnetSend([IAC, WILL, TTYPE])
	 }

	 console.log("IAC ", state, code)

  }
 
  export function handleTelnet(data, dataHandler, echoHandler, telnetSend) {

    if (telnetState === 0 && data === IAC) {
       telnetState = IAC;
       return;
    }

    if (telnetState === SB) {
	subMode = data;
	subData = []
	telnetState = 0;
	return;
    }

    if (telnetState === IAC) {
       if (data === WILL || data === WONT || data === DO ||
           data === DONT || data === SB) {
          telnetState = data;
          return;
       }

       if (data === SE && subMode != 0) {
	  if (subMode == TTYPE && subData.length === 1 && subData[0] === SEND) {
	        let cmd = [IAC, SB, TTYPE, IS]
	
	        const name = "chrysalis";

	        for (let idx = 0; idx < name.length; idx += 1) {
	             cmd.push(name.charCodeAt(idx))
	        }

		cmd.push(IAC)
		cmd.push(SE)

                telnetSend(cmd)
	  }
	  telnetState = 0;
	  subMode = 0;
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
       handleNegotiation(telnetState, data, echoHandler, telnetSend);
       telnetState = 0;
       return;
    }

    if (telnetState === 0) {
	if (subMode) {
	    subData.push(data)
	} else {
  	    dataHandler(data)
	}
    } else {
      console.error("unknown byte", data, "in state",  telnetState)
    }
  }

