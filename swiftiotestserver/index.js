var app = require('http').createServer((req, res) => {
    res.writeHead(500)
    res.end("failed")
})
var server = app.listen(8080)
var io = require('socket.io')(server, {
    // pingTimeout: 3000,
    // pingInterval: 10000,
    // path: "/test",
    //transports: ['websocket'],
    // allowUpgrades: true,
    // cookie: false
})
var fs = require("fs")
var println = console.log
var sentReconnect = false

var nsp = io.of("/swift")
nsp.on('connection', function(socket) {
    console.log("Someone joined swift")
    console.log("sid: " + socket.id)

    socket.on("nspBinary", function(data) {
        println(data)
    })

    socket.on("nspTest", function(data) {
        println(data)
    })

    socket.on("echo", function(data) {
        println("Got namespace testEcho")
    })

    socket.on("arrayTest", function(arr) {
        println("Got namespace array test " + arr)
    })
    socket.on("stringTest", function(str) {
        println("Got namepsace string test: " + str)
    })

    socket.on("boolTest", function(bool) {
        println("Got namespace bool test: " + bool)
    })

    socket.on("intTest", function(i) {
        println("Got namespace int test: " + i)
    })

    socket.on("doubleTest", function(dub) {
        println("Got namespace double test: " + dub)
    })

    socket.on("disconnect", function() {
        console.log("nsp leave")
    })

    socket.on("nested", function(data) {
        println("nested test")
        println(data)

        //console.log(data[1]["test2"]["test3"])
    })

    // socket.on("ackack", function(data, ack) {
    //     ack(new Buffer("binary ack"), {
    //         test: "test"
    //     })
    // })

    socket.emit("currentAmount", 2.50, function(str, str2) {
        console.log(str + str2)
    })

    socket.on("update", function(amount) {
        console.log(amount)
    })

    socket.on("canUpdate", function(num, ack) {
        console.log(num)
        ack(true)
    })

    socket.emit("nestedTest", {
        test: new Buffer("testNested")
    }, 2, [2, [new Buffer("testNested2"), {
        test: 1,
        buf: new Buffer("testNested3")
    }]])

    socket.emit("blankTest")
    socket.emit("nullTest", null)
    socket.emit("boolTest", true)
    socket.emit("stringTest", "lïne one\nlīne \rtwo")

    setTimeout(function() {
        socket.emit("unicodeTest", "lïne one\nlīne \rtwo𦅙𦅛")
    }, 2000)
    socket.emit("jsonTest", {
        foo: "string\ntest test"
    })
    socket.emit("arrayTest", [2, "test"])
    socket.emit("intTest", 2)
    socket.emit("doubleTest", 2.2)
    socket.emit("dataTest", new Buffer("testData"))
    socket.emit("multipleItems", [new Buffer("test1"), 2], [{test: "bob"}],2, "hello", new Buffer("test2"), "test")
    socket.emit("mult", 1, 2, 3, {
        foo: "bar"
    })

    socket.emit("ackEvent", "gakgakgak", function(re, name) {
        println("Got ack for ackEvent")
        println(re)
        println(name)
    })

    socket.emit("binaryAckEvent", new Buffer("gakgakgak2"), function(bin, str) {
        println(bin)
        println(str)
    })

    socket.emit("multAckEvent", new Buffer("gakgakgak3"), 2, function(re) {
        println(re)
    })
    //socket.emit("nspLeave")
})

// io.on("connection", function(socket) {
// 	console.log(socket.compress)

// 	socket.close()
// })
var closed = false
var timesClosed = 0
var numStress = 0
var before
var burstI
io.sockets.on("connection", (socket) => {
    socket.on("message", (msg) => {
        socket.broadcast.emit("message", msg)
    })
    console.log(socket.get)
    socket.join("testRoom")
    //socket.disconnect()

    console.log(socket.request._query)
    console.log(socket.request.headers)
    console.log("sid: " + socket.id)

    socket.on('spam', () => {
        for (var i = 0; i < 1000; i++) {
            socket.emit("someSpam", i, (True, False) => {
                console.log(`Got true ${True} and ${False}`)
            })
        }
    })

    socket.on("stressTestAck", (int, ack) => {
        console.log("stress ack" + int)
        ack("hello" + int)
    })

    socket.on('error', (data) => {
        console.log(data)
    })

    socket.on("test", function() {
        println("Got test")
    })

    socket.on("base64JSONTest", (str) => {
        var asJSON = JSON.parse(str)
        console.log(asJSON)
    })

    socket.on("jsonTest", function(data) {
        println(data["name"])
    })

    socket.on('customObj', (obj) => {
        console.log(`custom obj: ${obj.name} ${obj.age}`)
    })

    socket.on("disconnect", function() {
        println("disc")
        socket.disconnect()
    })

    //socket.emit("test", "test from all")
    println("got connection")

    socket.on("echo", function(data) {
        println("Got testEcho")
    })

    socket.on("arrayTest", function(arr) {
        println("Got array test " + arr)
    })
    socket.on("stringTest", function(str) {
        if (str !== "lïne one\nlīne \rtwo𦅙𦅛") {
            println("Failed string test")
        }
        println("Got string test: " + str)
    })

    socket.on("boolTest", function(bool) {
        println("Got bool test: " + bool)
    })

    socket.on("intTest", function(i) {
        println("Got int test: " + i)
    })

    socket.on("doubleTest", function(dub) {
        println("Got double test: " + dub)
    })

    socket.on("nested", function(data) {
        println("nested test")
        println(data)

        //console.log(data[1]["test2"]["test3"])
    })

    socket.on("jsonStringTest", (json) => {
        console.log("json string: " + JSON.parse(json)['myEvent'])
    })

    // socket.on("closeTest", function() {
    //     // if (timesClosed < 10) {
    //     //     println("closing socket")
    //     //     socket.conn.close()
    //     //     timesClosed++
    //     // }
    //
    //     socket.disconnect()
    // })

    socket.on("closeTest", function() {
        if (!sentReconnect) {
            sentReconnect = true
            socket.emit("deinit")
        }
    })

    socket.on("dataTest", function(data) {
        println("Got data test: " + data)
    })

    socket.on("binaryTest", function(data) {
        println(data["binary"])
    })

    var serverObj = {
        "amount": 0.00,
        "tips": 0.00
    }

    // socket.emit("setClientObject", serverObj)
    //
    // setInterval(function() {
    //     serverObj["amount"] += 0.10
    //     serverObj["tips"] += 0.20
    //
    //     socket.emit("updateClientObject", serverObj, function(res) {
    //         console.log(res)
    //     })
    // }, 1000)

    socket.on("ackack", function(str, ack) {
        console.log("got ackack")
        console.log(str)
            // ack(new Buffer("binary ack"))
        // ack({
        //     code: "200",
        //     message: [{
        //         msg: [{
        //             phone: "276"
        //         }, 2],
        //         name: "bob"
        //     }]
        // }, "test")

        ack(["hi", "hello"])
    })

    socket.on("ackack2", function(data, int, ack) {
        console.log("got ackack2")
        console.log(data)
        console.log(int)
        ack("got ackack2")
    })

    socket.on("rawTest", function(data) {
        println(data)
    })

    socket.on("binaryEmitAck", function(str, int, buf, ack) {
        println(str)
        println(int)
        println(buf)

        ack(new Buffer("Testing buffer"), {
            test: true
        })
    })

    socket.on("multData", function(data, data2) {
        println("Got mult data")
        println(data)
        println(data2)
    })

    socket.on("stopStress", function() {
        clearInterval(stress)
    })

    socket.on("multTest", function(array, dub, num, string, bool, obj, data) {
        console.log("Got multTest")
            // console.log(array)
            // console.log(dub)
            // console.log(num)
            // console.log(string)
            // console.log(bool)
            // console.log(obj)
            // console.log(data)
    })

    var emitStart
    var emitStressNum = 0
    socket.on("startEmitStress", function() {
        emitStart = new Date().getTime()
    })

    socket.on("emitStress", function() {
        emitStressNum++
    })

    socket.on("endEmitStress", function() {
        var end = new Date().getTime()
        console.log("Got: " + emitStressNum + " events in " + (end - emitStart) + " milliseconds")
    })

    socket.on("imageTest", function(ack) {
        console.log("Got image test")
        fs.readFile("/Users/eriklittle/Documents/swiftiotestserver/CaTBHah.png", function(err, data) {
            ack(data)
        })
    })

    socket.on("imageTestSend", img => {
        fs.writeFile("CaTBHah2.png", img)
    })

    // var burst = function() {
    //     for (var i = 0; i < 10; i++) {
    //         socket.emit("burstTest", [1, [2 + 2, {buf: new Buffer("testBurst" + timesClosed)}]])
    //     }
    // }

    //    burst()

    // socket.emit("currentAmount", 2.50, function(str, str2) {
    //     console.log(str + str2)
    // })

    socket.on("update", function(amount) {
        console.log(amount)
    })

    socket.on("canUpdate", function(num, ack) {
        console.log(num)
        ack(true)
    })

    // socket.emit("stringTest", "hello\nπ\rtest")

    socket.emit("nestedTest", {
        test: new Buffer("testNested")
    }, 2, [2, [new Buffer("testNested2"), {
        test: 1,
        buf: new Buffer("testNested3")
    }]])

    socket.emit("blankTest")
    socket.emit("nullTest", null)
    socket.emit("boolTest", true)
    socket.emit("stringTest", "lïne one\nlīne \rtwo")

    setTimeout(function() {
        socket.emit("unicodeTest", "lïne one\nlīne \rtwo𦅙𦅛")
    }, 2000)
    socket.emit("jsonTest", {
        foo: "string\ntest test"
    })
    socket.emit("arrayTest", [2, "test"])
    socket.emit("intTest", 2)
    socket.emit("doubleTest", 2.2)
    socket.emit("dataTest", new Buffer("testData"))
    socket.emit("multipleItems", [1, 2], {test: "bob"}, 25, "polo", new Buffer("gakgakgak2"))
    socket.emit("mult", 1, 2, 3, {
        foo: "bar"
    })

    socket.error({hello: new Buffer("hello")})
    socket.error(2, () => {
        console.log("got ack")
    })

    socket.emit("ackEvent", "gakgakgak", function(re, name) {
        println("Got ack for ackEvent")
        println(re)
        println(name)
    })

    socket.emit("binaryAckEvent", new Buffer("gakgakgak2"), function(bin, str) {
        println(bin)
        println(str)
    })

    socket.emit("multAckEvent", new Buffer("gakgakgak3"), 2, function(re) {
        println(re)
    })

    socket.emit(2, "test")
    socket.emit("testOnce")
    socket.emit("breakSocketIO")
    socket.emit("cyrllicTest", "Йопта", "Ы", "Привет")
    socket.emit('aaaa', {
        'a': 1,
        'b': {
            'c': {
                'test': 'foo'
            }
        }
    });

    setTimeout(() => { socket.emit("deinit") }, 1000)

})

// setInterval(function() {
//     io.to("testRoom").emit("roomTest", "Sending room test")
// }, 2000)
