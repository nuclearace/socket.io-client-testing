// swift-tools-version:3.1

import PackageDescription

let package = Package(
    name: "socket.io-test",
    dependencies: [
        .Package(url: "https://github.com/socketio/socket.io-client-swift", majorVersion: 11)
    ]
)
