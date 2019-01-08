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

  export function handleTerminal(data) {

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

