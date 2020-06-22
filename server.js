var fs = require('fs');
var https = require('https');
var path = require('path');
var express = require('express');
var app = express();


var options = {
  key: fs.readFileSync('certificate/privateKey.key'),
  cert: fs.readFileSync('certificate/certificate.crt')
};
var serverPort = 8888;

var server = https.createServer(options, app);
var io = require('socket.io')(server);

app.use(express.static(path.join(__dirname,'assets')));
app.set('view engine','ejs');
app.set('views','views');

app.get('/',(req,res,next) => {
    res.render('login.ejs');
});
app.get('/register',(req,res,next) => {
    res.render('register.ejs');
});
app.get('/messenger',(req,res,next) => {
    res.render('messenger.ejs');
});





users = {};

io.on('connection', function (connection) 
{
    connection.on('login', function (message) 
    {
        data = JSON.parse(message);
        console.log('new user is connected :: '+data.name);
        users[data.userid] = connection;
        connection.id = data.userid;
        connection.name = data.name;
        
    });
    connection.on('calling', function (message) 
    {
        data = JSON.parse(message);
        calling_emit = {
            caller:data.caller
        };
        if(users[data.reciver])
        {
            sendTo('RecieverCall',users[data.reciver],calling_emit);
            console.log(data.caller+' is calling '+data.reciver);    
        }
    });

    connection.on('hangup', function (message) 
    {
        data = JSON.parse(message);
        if(users[data.to])
        {
            noting = {
                nothing:data.to
            };
            sendTo('closeCall',users[data.to],noting);
            console.log(data.to+' finishing sending call ');    
        }
    });
    connection.on('Callanwser', function (message) 
    {
        data = JSON.parse(message);
        if(users[data.to])
        {
            dataTosend = {
                to:data.to,
                peeId:data.PeeId
            };
            sendTo('accepteCall',users[data.to],dataTosend);
            console.log(data.to+'Video Call Startiing ...');    
        }
    });

    

    connection.on('disconnect', function () 
    {
        console.log('user disconnected :: '+connection.name);
        delete users[connection.id];
    });
});

server.listen(serverPort, function() {
  console.log('server up and running at %s port', serverPort);
});

function sendTo(event,conn, message) 
{
    conn.emit(event,JSON.stringify(message));
}