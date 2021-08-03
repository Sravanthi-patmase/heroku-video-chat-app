let express = require('express');
let app = express();
let server = require( 'http' ).Server( app );
let io = require( 'socket.io' )( server );
// let stream = require( './stream.js' );
let path = require( 'path' );
let favicon = require( 'serve-favicon' );

app.use( favicon( path.join( __dirname, 'favicon.ico' ) ) );
app.use( '/src', express.static( path.join( __dirname, 'src' ) ) );
app.use("/src", express.static('./src/'));

app.get( '/', ( req, res ) => {
    console.log('LLLL')
    res.sendFile( __dirname + '/index.html' );
} );

// io.of( '/stream' ).on( 'connection', stream );
var port  = process.env.port || 8080;
server.listen(port);
console.log("55555");

io.on("connection", (socket) => {
    console.log('connected server')
    socket.on( 'subscribe', ( data ) => {
        //subscribe/join a room
        socket.join( data.room );
        socket.join( data.socketId );

        //Inform other members in the room of new user's arrival
        if ( socket.adapter.rooms.get[data.room] != 'undefined' ) {
            socket.to( data.room ).emit( 'new user', { socketId: data.socketId } );
        }
    } );


    socket.on( 'newUserStart', ( data ) => {
        socket.to( data.to ).emit( 'newUserStart', { sender: data.sender } );
    } );


    socket.on( 'sdp', ( data ) => {
        console.log('sdp connected')
        socket.to( data.to ).emit( 'sdp', { description: data.description, sender: data.sender } );
    } );


    socket.on( 'ice candidates', ( data ) => {
        console.log('onicecand')
        socket.to( data.to ).emit( 'ice candidates', { candidate: data.candidate, sender: data.sender } );
    } );


    socket.on( 'chat', ( data ) => {
        socket.to( data.room ).emit( 'chat', { sender: data.sender, msg: data.msg } );
    } );
});


