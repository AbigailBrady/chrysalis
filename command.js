import { htmlescape } from "./utils.js"

import { socketSend } from "./socket.js"

import { appendCommand } from "./terminal.js"

const command = document.getElementById("command")

function sendCommand(value) {
    const cmd = []

    for (let idx = 0; idx < value.length; idx += 1) {
      cmd.push(value.charCodeAt(idx))
    }

    cmd.push(10)
    cmd.push(13)

    socketSend(cmd)
}
 
let edittext = "";
let editpos = 0;
let editpassword = false;

function indicateCursorPos(string, pos) {
	let ret = "";
	for (let i = 0; i < string.length; i += 1) {
		if (pos === i) {
			ret += "<span class=\"cursor\">"
		}
		ret += editpassword ? "*" : htmlescape(string[i]);
		if (pos === i) {
			ret += "</span>"
		}
	}
	if (pos === string.length) {
		ret += "<span class=\"cursor\">&nbsp;</span>"
	}
	return ret;
}

function updateCommandText() {
	command.innerHTML = indicateCursorPos(edittext, editpos)
}

export function setEcho(yes)
{
	editpassword = !yes
}


updateCommandText()

export function keyDown(event) {
	
	if (event.key === "Enter") {
		sendCommand(edittext)
      		if (!editpassword) {
			appendCommand(edittext)
		}
		edittext = "";
		editpos = 0;
		event.preventDefault()
		updateCommandText()
	}

	if (event.key === "Backspace") {
		if (editpos > 0) {
			edittext = edittext.substr(0, editpos - 1) + edittext.substr(editpos)
			editpos -= 1;
			event.preventDefault()
			updateCommandText();
		}
	}
	
	if (event.key === "ArrowLeft") {
		if (editpos > 0) {
			editpos -= 1;
			event.preventDefault()
			updateCommandText();
		}
	}
	
	if (event.key === "ArrowRight") {
		if (editpos < edittext.length) {
			editpos += 1;
			event.preventDefault()
			updateCommandText();
		}
	}

	if (event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
		edittext = edittext.substr(0, editpos) + event.key + edittext.substr(editpos)
		editpos += 1;
		event.preventDefault()
		updateCommandText()
	}

	if (event.key === "Home" || (event.key === "a" && event.ctrlKey)) {
		editpos = 0;
		event.preventDefault()
		updateCommandText()
	}
	if (event.key === "End" || (event.key === "e" && event.ctrlKey)) {
		editpos = edittext.length;
		event.preventDefault()
		updateCommandText()
	}

}


