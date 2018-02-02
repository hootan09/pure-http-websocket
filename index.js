const http = require('http');
const http_serv = http.createServer(HandleRequest);

const io = require('socket.io').listen(http_serv);
io.on('connection' , Handleio);

const fs = require('fs');

function HandleRequest(req , res){
    if(req.method === "GET"){
        if(req.url === "/"){

            res.writeHead(200 , {"Content-type": "text/html"});

            // res.write('<h1>mamad niki</h1>');
            // res.end('hello world');

            //var content = fs.readFileSync("./index.html"); //for more performance comment this & use async
            //res.end(content);
            fs.readFile("./index.html" , (err, content) =>{
                if(err){
                    res.end('error in serving page');
                }
                else {
                    res.end(content);
                }
            });
        }
        else{
            res.writeHead(403);
            res.end("wrong route");
        }
    }
    else{
        res.writeHead(403);
        res.end("wrong http method")
    }  
}

function Handleio(socket){

    function disconnect(){
        console.log('client disconnected');
        clearInterval(intv);
    }

    console.log('client connected');
    socket.on('disconnect' , disconnect)

    //send random number to client
    var intv = setInterval(()=>{
        //socket.emit("random" ,Math.random());//sends different random to each client
        io.emit("random" , Math.random());//sends same random number to all clients
    },1000);

    socket.on("typeit" , msg => {
        socket.broadcast.emit('messages' , msg);//send to every one except the sender
        //io.emit('message' , msg);//send to all
    });
}






http_serv.listen(3000 , console.log('Server is runnig on port 3000'));
