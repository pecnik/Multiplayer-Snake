const express = require("express");

const PORT = 8080;

const app = express();
app.use("/", express.static(__dirname + "/dist"));
// app.use("/assets", express.static(__dirname + "/assets"));

// use  bundler
const env = process.env.NODE_ENV.trim();
if (env === "development") {
    const path = require("path");
    const Bundler = require("parcel-bundler");
    const entryFile = path.join(__dirname, "./src/client/index.html");

    // @ts-ignore
    const bundler = new Bundler(entryFile, { hmr: false });

    // @ts-ignore
    app.use(bundler.middleware());
}

// run game server
const srv = app.listen(PORT);
const io = require("socket.io").listen(srv);
const { runGameServer } = require("./src/server/Server");
runGameServer(io);
