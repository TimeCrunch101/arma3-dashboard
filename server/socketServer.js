// const { createServer } = require("https");
const { createServer } = require("http");
const { Server } = require("socket.io");
// const fs = require('fs')

const httpsServer = createServer({
  // key: fs.readFileSync(__dirname + "/certs/socketCerts/selfsigned.key"),
  // cert: fs.readFileSync(__dirname + "/certs/socketCerts/selfsigned.crt")
});

const io = new Server(httpsServer, {
  cors: {
    origin: "*"
  }
});

io.on("connection", (socket) => {
  console.log('connection')
});

const sendStream = (streamname, data) => {
    io.sockets.emit(streamname, data)
}

// httpsServer.listen(8081, console.log(`Socket Server: https://localhost:${8081}/socket.io/socket.io.js`));
httpsServer.listen(8081, console.log(`Socket Server: http://localhost:${8081}/socket.io/socket.io.js`));

module.exports = {
    sendStream: sendStream,
}