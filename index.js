const { Socket } = require("dgram");
const { static } = require("express");
const express = require("express");
const path = require("path");
const app = express();
const socket = require("socket.io");
let socketlist=[];let canvasList=[];
let leader;var dict=[],userList=[];
let infavour=0,against=0;
const PORT =process.env.PORT || 8080;
const server = app.listen(PORT, ()=>{
    console.log(`the server is running on port ${PORT}`)
})


app.use(express.static(path.join(__dirname, "public")));



const io = socket(server);


io.on("connection", (socket)=>{
    socketlist.push(socket.id);
    console.log(socketlist);
    
    if (socketlist.length>1 ){
        
        leader=socketlist[0];
        
        io.to(leader || socketlist[0]).emit("get","data");
        console.log("emitted get to "+leader);

    }

    socket.on("get", (data)=>{
        console.log("server received get");
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
    socket.on("startvote", data=>{
        socket.broadcast.emit("startvote");
    })
    socket.on("myvote", data=>{
        if(data){infavour+=1;}else{against+=1;}
        if(infavour>(socketlist.length/2)-1){
            io.to(leader).emit("save",data);
        }
    })
    socket.on("user", data=>{
        userList.push(data);
        let x={};
        x['id']=socket.id;
        x['name']=data;
        dict.push(x);
        console.log("dictionary data:"+dict[0].name);
        socket.broadcast.emit("user",dict);
        io.to(socket.id).emit("user",dict);
        console.log(userList);
    })
    socket.on("save", data=>{
        canvasList.push(data);
        console.log(canvasList);
    })
    socket.on("disconnect", data=>{
        console.log("disconnect : "+socket.id);
        const inde = socketlist.indexOf(socket.id);
        if (inde > -1) {
             socketlist.splice(inde, 1);
        }
        //console.log("popping leader:"+socketlist);
        leader=socketlist[0];
        for(i = 0; i < dict.length; i++){
            if (dict[i].id==socket.id){
               console.log(i);
                if (i > -1) {
                    dict.splice(i, 1);
               }
            }
        }
        socket.broadcast.emit("user",dict);
        io.to(socket.id).emit("user",dict);
        
        //console.log("new leader after leader disconenct: "+ leader);
        //socket.broadcast.emit("clear");
    })

})
