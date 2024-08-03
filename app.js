const { log } = require("console");
const express = require("express");
const app = express();
const http = require('http');
const path = require("path");


const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);  
/*const io = socketio(server, {
    pingInterval: 10000, // every 10 seconds
    pingTimeout: 5000,   // wait for 5 seconds before assuming the client is disconnected
});*/

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set(express.static(path.join(__dirname, "public")));

io.on("connection", function (socket){
    socket.on("send-location", function (data){
        io.emit("recieve-location", {id: socket.id,...data });
    });
    socket.on("disconnect", function (){
        io.emit("user-disconnected", socket.id);
    });
});

app.get('/',(req,res) => {
    res.render("index");
})
server.listen(3000);
