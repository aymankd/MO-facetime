var fs = require('fs');
var https = require('https');

var express = require('express');
var app = express();

var options = {
  key: fs.readFileSync('certificate/privateKey.key'),
  cert: fs.readFileSync('certificate/certificate.crt')
};
var serverPort = 8888;

var server = https.createServer(options, app);
var io = require('socket.io')(server);



app.get('/',(req, res, next) => {
    res.sendFile(__dirname + '\\..\\messenger.html');
});


/*

app.all('/',(req, res, next) => {
    res.sendFile(__dirname + '\\..\\messenger.html');
});

app.all('/messaging',(req, res, next) => {
    res.send('hello from messaging')
});
app.use((req, res, next) => {
    res.send('404 page not found')
});


*/




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