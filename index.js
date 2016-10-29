/*** Require ***/

const fs = require( 'fs' )

const request = require( 'request' )

const child_process = require( 'child_process' )
const exec = child_process.exec

const utility = require( './libs/utility' )
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
    
    socket.on( 'capture', ( raw ) => {
        const path = utility.fixPath( __dirname, 'tmp', 'captured.png' )
        fs.writeFile( path, utility.decodeBase64Image( raw ).data, function( error ){ 
            if( !error )
                checkType( path )
        } )
    } )
    
} )

/*** Check flower ***/

function checkType( filePath ){
    child_process.exec( 'python vision/msVisionDummy.py ' + filePath, function( error, stdOut, stdError ){
        console.log(error)
        if( !error && !stdError ){
            const data = JSON.parse( stdOut )
            const tags = data.description.tags.filter( ( e ) => e.toLowerCase() )
            if( tags.indexOf( 'flower' ) !== -1 )
                main()
        }
    } )
}

function main(){
    console.log( 'aaa' )
}