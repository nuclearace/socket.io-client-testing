var socket = require('socket.io-client')("http://localhost:8080", {transports: ["websocket"]})

socket.on("connect", function() {
	console.log("connected")
	socket.emit("stringTest", "test1\ntest2", function(test) {

	})
	// socket.emit("startEmitStress")
	// for (var i = 0; i < 1000; i++) {
	// 	socket.emit("emitStress", {name: "bob"})
	// }
	// socket.emit("endEmitStress")
})

socket.on("shortm", function(data) {
	console.log(data)
})

socket.on("ackTest", ack => {
	ack("test")
})

var startTime = new Date().getTime()
var num = 0
socket.on("startStress", function() {
	startTime = new Date().getTime()
})

socket.on("stressTest", function(i, data) {
	num++
	// if (num === 1000) {
	// 	socket.emit("endStress")
	// 	var end = new Date().getTime() - startTime
	// 	console.log("Did " + num + " events in " + end)
	// }
})

socket.on("endStress", function() {
	var end = new Date().getTime() - startTime
	console.log("Did " + num + " events in " + end)
})

socket.on('unicodeTest', (data) => {
    console.log(data)
    socket.emit('stringTest', 'lïne one\nlīne \rtwo𦅙𦅛')
})

socket.connect()
