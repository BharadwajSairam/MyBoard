const socket = io();

socket.emit("hello", "some data");
document.getElementById("clear").disabled = true;
        document.getElementById("elect").disabled = true;

 window.addEventListener("load", ()=>{
    var person = prompt("Please enter your name", "user");
    socket.emit("user",person);
    console.log("user data sent");
 })
 socket.on("user",function(data){
    console.log("userdata"+data);
    var l=[];
    l=data;
    console.log(l[0].name);
    var list = document.createElement('ul');
    document.getElementById("userList").innerHTML='<ul></ul>';
    for(i = 0; i < l.length; i++) {
        // Create the list item:
        var item = document.createElement('li');
        console.log(l[i].name);
        // Set its contents:
        item.appendChild(document.createTextNode(l[i].name));

        // Add it to the list:
        list.appendChild(item);
    }

    document.getElementById('userList').appendChild(list);
 })
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    // document
    //resizing
    canvas.height = window.innerHeight/2;
    canvas.width = window.innerWidth/2;
    
    //variables
    let painting = false;
    let tool = "draw";
    let color = "black"

    const setTool = (string)=>{
        tool = string;
        if(tool === "erase"){
            socket.emit("erase")
        }else{
            socket.emit("unerase")
        }
    }

    const clear = ()=>{
        ctx.clearRect(0,0,canvas.width,canvas.height);
        socket.emit("clear")
    }

    const setColor = string=>{
        color = string;
    }

    function elect() {
       
        socket.emit("startvote");
        console.log("emitted vote call to server");
        /*if (r == true) {
          txt = "You pressed OK!";
        } else {
          txt = "You pressed Cancel!";
        }*/
        
      }

    const startPosition =(x,y,peerColor)=>{
        console.log(tool)
        ctx.lineCap = 'round';
        ctx.moveTo(x, y);
        ctx.beginPath();
        switch(tool){
            case "erase":
                ctx.lineWidth = 20;
                painting = true;
                ctx.strokeStyle = "black";
                ctx.globalCompositeOperation = 'destination-out';
             break;
             case "draw":
                ctx.globalCompositeOperation = 'source-over';
                if(peerColor){
                    ctx.strokeStyle = peerColor;
                }else{
                    ctx.strokeStyle = color;
                }
                painting = true;
                draw(x,y);
                ctx.lineWidth = 6;
             break;
             default: //do nothing   

        }
    }



    const finishedPosition = ()=>{
        painting = false;
    }

    const draw = (x,y)=>{
         if(!painting) return;
        //  if(erase){

        //  }
         ctx.lineTo(x, y);
         ctx.lineCap = "round";
         ctx.stroke()
    }


    const drawFunc = (e)=>{
        // console.log(e)
        const x = e.clientX;
        const y = e.clientY;
        let type;
        switch(e.type){
            case "mousedown": type = "start";
             break;
            case "mouseup": type ="stop";
            break;
            case "mousemove": type="draw";
            default: //
        }

        if(painting || type === "start")
        socket.emit("draw", {x,y,type,color});
        
        let dot={x,y,type,color};
        //console.log(dot);
        switch(type){
            case "start": startPosition(x,y,false);
            break;
            case "stop": finishedPosition();
            break;
            case "draw": draw(x,y)
        }
    }


    socket.on("draw", data=>{
        const {x,y,type, color} = data;
        //console.log(x,y,type,color);
        switch(type){
            case "start": startPosition(x,y,color);
            break;
            case "stop": finishedPosition();
            break;
            case "draw": draw(x,y)
        }

    })

    socket.on("erase", ()=>{
        tool = "erase"
    })

    socket.on("unerase", ()=>{
        tool = "draw"
    })
    socket.on("clear", ()=>{
        ctx.clearRect(0,0,canvas.width,canvas.height);
    })




    //event listeners
     document.getElementById("draw").addEventListener("click", ()=>{
        setTool("draw")
     });

    document.getElementById("erase").addEventListener("click", ()=>{
        setTool("erase")
    });
    document.getElementById("elect").addEventListener("click", ()=>{
       
     });
    document.querySelectorAll(".colors").forEach(el=>{
        el.addEventListener("click", (e)=>{
            setColor(e.currentTarget.style.backgroundColor);
            // console.log(e.currentTarget.style.backgroundColor);
        })
    })
    document.onload=function(){};
    document.getElementById("clear").addEventListener("click", clear)
    canvas.addEventListener("mousedown", drawFunc);
    canvas.addEventListener("mouseup", drawFunc);
    canvas.addEventListener("mousemove", drawFunc);


    const elec=document.querySelector("#elect");
    const im=document.querySelector("#im");
    elec.addEventListener("click",elect);
    
    socket.on("get",function(){
        console.log("client get");
        socket.emit("get",canvas.toDataURL());
        console.log("emitted dataurl to server");
        document.getElementById("clear").disabled = false;
        document.getElementById("elect").disabled = false;
    })
    
    socket.on("save",function(){
       /* var link = document.getElementById('link');
        link.setAttribute('download', 'image.png');
        link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
        link.click();*/
        socket.emit("save",canvas.toDataURL());
        //socket.emit("test",canvas.toBuffer('image/png'));
        console.log("emitted dataurl to save call");
    })

    socket.on("init",function(data){
        console.log("client init"+ data);
        const canv=document.getElementById("canvas");
        const ct = canvas.getContext("2d");
        const img=new Image();
        img.onload=function(){
            ct.drawImage(img,0,0);
        }
        img.src=data;       
        
    })

    socket.on("startvote",function(){
        var txt;
        //var r = confirm("Do you want to save this drawing ? :");
        socket.emit("myvote",confirm("Do you want to save this drawing ? :"));
    })

    document.getElementById("savedCanvas").addEventListener("click", function(){
        socket.emit("show","image");
        console.log("clicked on saved canvas");
    });
    socket.on("show",function(data){
        console.log("show called"+data);
        const canva=document.getElementById("canva");
        const ctx1 = canva.getContext("2d");
        const img=new Image();
        img.onload=function(){
            ctx1.drawImage(img,0,0);
        }
        img.src=data;       

    })