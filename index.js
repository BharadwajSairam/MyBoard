const admin = require('firebase-admin');
const serviceAccount = require('./key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();
const docRef = db.collection('users').doc('data');
const y=async()=>{
    await docRef.set({
        first: ''
      });
}
y();
var snapshot;
const z=async()=>{
    snapshot = await db.collection('users');
}
z();
const { Socket } = require("dgram");
const { static } = require("express");
const express = require("express");
const path = require("path");
//const fs = require("fs");
const app = express();
const socket = require("socket.io");
let socketlist=[];let canvasList=[];
let leader;var dict=[],userList=[];
let infavour=0,against=0;
const PORT =process.env.PORT || 80;
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
    var data1;
    const x=async(data)=>{
        await docRef.update({first: data});
        s();
        console.log('update finished');
    };
    const s=()=>{
        snapshot.get().then((item)=>{
            const items=item.docs.map((doc)=>doc.data());
            items.map((user)=>{
            data1=user.first;
            });
            console.log("data11111=--"+data1);
            io.to(socketlist[socketlist.length-1]).emit("init",data1);
            console.log('data emittedooooo');
        });
    }
    socket.on("get", (data)=>{
        console.log("server received get");
        console.log("new client "+socketlist[socketlist.length-1]);
        console.log('----****----'+data);
        x(data);           
    });

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
            console.log("positive votes");
            io.to(leader).emit("save",data);
        }
    });
    socket.on("user", data=>{
        userList.push(data);
        let x={};
        x['id']=socket.id;
        x['name']=data;
        dict.push(x);
        socket.broadcast.emit("user",dict);
        io.to(socket.id).emit("user",dict);
        console.log(userList);
    });
    socket.on("save", data=>{
        canvasList.push(data);
        console.log(data);
    });
    socket.on("show", data=>{
        console.log("sending saved data")
        io.to(socket.id).emit("show",canvasList[canvasList.length-1]);
    });
    socket.on("test", data=>{
        console.log("canvas.buffer");
        //fs.writeFileSync('./test.png', data);
    });

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
    })

});
