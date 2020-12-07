const socket = io();

socket.emit("hello", "some data");


// window.addEventListener("load", ()=>{
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


    const elect=document.querySelector("#elect");
    const im=document.querySelector("#im");
    elect.addEventListener("click",function(){
        console.log("---");
        const dataURL=canvas.toDataURL();
        
         im.src=dataURL;
    })
    socket.on("get",function(){
        console.log("client get");
        socket.emit("get",canvas.toDataURL());
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