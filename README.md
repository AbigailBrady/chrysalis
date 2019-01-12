This is Chrysalis, a websocket-based MUD client.

It is now nearly ready for production use.  To install on your MUD, just 
serve these files, altering settings.js to have the websock URL.  Becasuse 
websockets use a HTTP frame rather than being raw sockets, you'll need to
run a websocket proxy on a server.  I have been using websockify
(github.com/novnc/websockify)


Open issues:
  IAC IAC handling, UTF-8 support in general
  the width detection doesn't seem to be quite right
  should i use jQuery more?
  ctrl-C to kill line (maybe other keyboard shortcuts?)
  issue with blank lines appearinging in buffer 
