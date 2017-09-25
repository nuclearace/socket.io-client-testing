// swift-tools-version:4.0

import PackageDescription

let package = Package(
    name: "socket.io-test",
    products: [
        .executable(name: "socket.io-test", targets: ["Runner"])
    ],
    dependencies: [
        .package(url: "https://github.com/socketio/socket.io-client-swift", .upToNextMajor(from: "12.0.0"))
    ],
    targets: [
        .target(name: "Runner", dependencies: ["SocketIO"], path: "./Sources")
    ]
)
