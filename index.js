/*** Require ***/

const request = require( 'request' )

const child_process = require( 'child_process' )
const exec = child_process.exec

const config = require( './core/config' ).config

/*** Server and Client ***/

const express  = require( './libs/express' ),
      electron = require( './libs/electron' )

const runtime = express.run()
electron.run( runtime.port )

const io = require( 'socket.io' )( runtime.http )

io.sockets.on( 'connection', function( socket ){
    
    socket.on( 'message', ( message ) => {
        request( config.message.base + config.message.endPoint.chat + '?message=' + encodeURI( message ) + '&key=' + config.message.key, ( error, response, body ) => {
            if( !error && response.statusCode == 200 )
                io.sockets.to( socket.id ).emit( 'message', JSON.parse( body ).result )
        } )
    } )
    
} )

/*** Check flower ***/

child_process.exec( 'python ./vision/msVisionDummy.py /Users/calmery/Desktop/a.jpeg', function( error, stdOut, stdError ){
    if( !error && !stdError ){
        const data = JSON.parse( stdOut )
        const tags = data.description.tags.filter( ( e ) => e.toLowerCase() )
        if( tags.indexOf( 'flower' ) !== -1 )
            main()
    }
} )

function main(){
    console.log( 'aaa' )
}