  const output = document.getElementById("output")

  let attr = {
	  bold: false,
	  faint: false,
	  fgcol: "white",
	  bgcol: "black",
	  ital: false,
	  und: false,
	  und2: false,
	  over: false,
	  inv: false,
	  str: false,
	  hide: false,
  }

  function attrToClass(myattr) {
	  let str = "";
	  let fg = myattr.fgcol;
	  let bg = myattr.bgcol;
	  if (myattr.inv) {
		  fg = myattr.bgcol;
		  bg = myattr.fgcol;
	  }
	  if (myattr.hide) {
		  fg = bg;
	  }
	  if (attr.faint) {
	    str = "term_fg" + fg + "faint";
	  } else if (attr.bold) {
	    str = "term_fg" + fg + "bold";
	  } else {
	    str = "term_fg" + fg;
	  }
	  str += " term_bg" + bg;
	  if (attr.ital) {
		  str += " term_ital"
	  }
	  if (attr.und) {
		  str += " term_und"
	  }
	  if (attr.over) {
		  str += " term_over"
	  }
	  if (attr.und2) {
		  str += " term_und2"
	  }
	  if (attr.str) {
		  str += " term_str"
	  }
	  return str;
  }

  let lastCls = "";

  let outData = "";

  function handleChar(data) {
    const cls = attrToClass(attr);

    if (data === 13) {
      outData += "<br />";
    } else {
      let char = String.fromCharCode(data)
      if (char === " ") char = "&nbsp;"
      if (char === "<") char = "&lt;"
      if (char === ">") char = "&gt;"
      if (char === "&") char = "&amp;"

      let outHTML = "";

      if (cls !== lastCls) {
	      outHTML += `</span><span class="${cls}">`
	      lastCls = cls;
      }
      outHTML += char;
      outData += outHTML;

      output.innerHTML = outData;
    }
  }

  export function appendCommand(command) {
     outData += command
     outData += "<br />"
      
     output.innerHTML = outData;
  }
  
  let defattr = Object.assign({}, attr);

  function handleColorCommand(cmd) {
	  switch (cmd) {
		  case "": case "0": attr = Object.assign({}, defattr); break 
		case "1": attr.bold = true; break;
		case "2": attr.faint = true; break;
		case "3": attr.ital = true; break;
		case "9": attr.str = true; break;
		case "4": attr.und = true; break;
		case "7": attr.inv = true; break;
		case "8": attr.hide = true; break;
		case "21": attr.und2 = true; break;
		case "22": attr.bold = false; attr.faint = false; break;
		case "23": attr.ital = false; break;
		case "24": attr.und = false; break;
		case "27": attr.inv = false; break;
		case "28": attr.hide = false; break;
		case "29": attr.str = false; break;
		case "30": attr.fgcol = "black";  break;
		case "31": attr.fgcol = "red";  break;
		case "32": attr.fgcol = "green"; break;
		case "33": attr.fgcol = "yellow";  break;
		case "34": attr.fgcol = "blue";  break;
		case "35": attr.fgcol = "magenta";  break;
		case "36": attr.fgcol = "cyan";  break;
		case "37": attr.fgcol = "white"; break;
		case "39": attr.fgcol = "white"; break;
		case "40": attr.bgcol = "black";  break;
		case "41": attr.bgcol = "red";  break;
		case "42": attr.bgcol = "green"; break;
		case "43": attr.bgcol = "yellow";  break;
		case "44": attr.bgcol = "blue";  break;
		case "45": attr.bgcol = "magenta";  break;
		case "46": attr.bgcol = "cyan";  break;
		case "47": attr.bgcol = "white"; break;
		case "49": attr.bgcol = "black"; break;
		case "53": attr.over = true; break;
		case "55": attr.over = false; break;
		  default: console.log("unknown ANSI code", cmd)
		}
  }

  function handleEscape(str, code)
  {
    if (code === "m" && str[0] === "[") {
      let commands = str.substr(1).split(";")
	    if (commands.length === 0) { commands = [0] }
      commands.forEach(handleColorCommand)
    }
  }

  let esc = false;
  let escStr = "";
 
  const ESC = 27;  

  function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
  }

  export function handleTerminal(data) {

    const str = String.fromCharCode(data)

    if (esc) {
        if (isLetter(str)) {
	   handleEscape(escStr, str)
           esc = false;
	   escStr = "";
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

