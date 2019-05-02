const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const RpsGame = require('./rps-game');

const app = express();
const server = http.createServer(app);

const io = socketio(server);

let waitPlayer = null;

//io connection!!!
io.on('connection', (sock) => {
    if (waitPlayer) {
        new RpsGame(waitPlayer, sock);
        waitPlayer = null;

    } else {
        waitPlayer = sock;
        waitPlayer.emit('msg', 'Waiting for an opponent');
    }

    sock.on('msg', (text) => {
        io.emit('msg', text);
    });
});

const clientPath = `${__dirname}/../client`;
//console.groupCollapsed(`serveing statif from ${clientPath}`);

app.use(express.static(clientPath));


//error!
server.on('error', (err) => {
    console.error('Server Error: ', err);
})
//server listen
server.listen(process.env.PORT || 8080, function() {
   console.log('listen On 8080');
});