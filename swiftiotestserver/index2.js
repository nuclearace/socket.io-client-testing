var options = {
  pingTimeout: 3000,
  pingInterval: 3000,
  cookie: false
};

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server, options);

server.listen(3000, function (err) {
  console.log('server running...');
});

io.on('connection', function (socket) {
  console.log('connected');

  socket.on('disconnect', function () {
    console.log('disconnected');
  })
});
