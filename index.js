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

/* Flower */

const personality = [ 'cat', 'dog', undefined ]

var me = {
    name: null,
    personality: null,
    history: [],
    character: true
}

io.sockets.on( 'connection', function( socket ){
    
    /*** Check flower ***/

    function checkType( filePath ){
        child_process.exec( 'python vision/msVisionDummy.py ' + filePath, function( error, stdOut, stdError ){
            if( !error && !stdError ){
                const data = JSON.parse( stdOut )
                const tags = data.description.tags.filter( ( e ) => e.toLowerCase() ).join( '' )
                if( tags.indexOf( 'flower' ) !== -1 || tags.indexOf( 'plant' ) !== -1 )
                    setNewFlower( data )
            }
        } )
    }
    
    function setNewFlower( data ){
        
        me.name = null
        me.personality = null
        me.history = []
        
        me.personality = personality[Math.floor( Math.random() * 3 )]
        console.log( 'This flower personality is ' + ( me.personality ? me.personality : 'normal' ) )
        
        socket.emit( 'setupComplated', me )
        
    }
    
    socket.on( 'message', ( message ) => {
        request( config.message.base + config.message.endPoint.chat + '?message=' + encodeURI( message ) + '&key=' + config.message.key, ( error, response, body ) => {
            if( !error && response.statusCode == 200 ){
                var responseMessage = JSON.parse( body ).result
                if( me.personality !== undefined ){
                    request( config.message.base + config.message.endPoint.character + '?message=' + encodeURI( responseMessage ) + '&key=' + config.message.key + '&character_type=' + me.personality, ( error, response, body ) => {
                        if( !error && response.statusCode == 200 ){
                            io.sockets.to( socket.id ).emit( 'message', JSON.parse( body ).result )
                        }
                    })
                } else io.sockets.to( socket.id ).emit( 'message', responseMessage )
            }
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