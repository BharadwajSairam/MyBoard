const { Socket } = require("dgram");
const { static } = require("express");
const express = require("express");
const path = require("path");
const app = express();
const socket = require("socket.io");
const { Socket } = require("dgram");
const { static } = require("express");
const express = require("express");
const path = require("path");
const app = express();
const socket = require("socket.io");
let socketlist=new Array();


const PORT =process.env.PORT || 3000;

const server = app.listen(PORT, ()=>{
    console.log(`the server is running on port ${PORT}`)
})


app.use(express.static(path.join(__dirname, "public")));



const io = socket(server);


io.on("connection", (socket)=>{
    socketlist.push(socket.id);
    if (socketlist.length>1 ){
    io.to(socketlist[0]).emit("get","data");}
    socket.on("get", (data)=>{
        console.log("server received get"+data);
        console.log("new client "+socketlist[socketlist.length-1]);
        io.to(socketlist[socketlist.length-1]).emit("init",data);
    })

    console.log(socket.id + "has just connected");

    socket.on("hello", (data)=>{
        console.log(data)
    })

    socket.on("draw", data=>{
        socket.broadcast.emit("draw", data);
    })

    socket.on("erase", data=>{
        socket.broadcast.emit("erase", data);
    })
    socket.on("unerase", data=>{
        socket.broadcast.emit("unerase", data);
    })
    socket.on("clear", data=>{
        socket.broadcast.emit("clear");
    })
    socket.on("save", data=>{
        socket.broadcast.emit("clear");
    })
})
