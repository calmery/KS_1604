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

const personality = [ 'cat', 'dog', 'ojousama' ]

var me = {
    name: null,
    personality: null,
    history: [],
    character: true
}

io.sockets.on( 'connection', function( socket ){
    
    /*** Check flower ***/

    function checkType(hue){
        var filePath = utility.fixPath( __dirname, 'tmp', 'captured.png' )
        console.log( 'Vision : ' + 'python vision/msVision.py ' + filePath )
        
        child_process.exec( 'python ./vision/msVisionDummy.py ' + filePath, function( error, stdOut, stdError ){
            if( !error && !stdError ){
                const data = JSON.parse( stdOut )
                console.log(data)
                const tags = data.description.tags.filter( ( e ) => e.toLowerCase() ).join( '' )
                if( tags.indexOf( 'flower' ) !== -1 || tags.indexOf( 'plant' ) !== -1 )
                    setNewFlower( data, hue )
                } else {
                    console.log( error )
                }
        } )
    }
    
    function setNewFlower( data, hue ){
        
        console.log( 'set flower name : ' + hue )
        
        me.name = null
        me.personality = null
        
        if( 0 <= hue && hue < 120 ) me.personality = 'dog'
        else if( 120 <= hue && hue < 240 ) me.personality = 'cat'
        else if( 240 <= hue && hue < 360 ) me.personality = 'ojousama'
        
        // me.personality = 'cat'
        
        console.log( 'This flower personality is ' + me.personality )
        
        /*
        request.post({
            url: "https://www.googleapis.com/urlshortener/v1/url",
            headers: {
                'Content-Type': 'application/json'
            },
            json: true,
            body: JSON.stringify({
                longUrl: 'https://calmery.sakura.ne.jp/rtc'
            }),
        }, function(error, response, body) {
            console.log(response)
        } )
        */
        
        socket.emit( 'setupComplated', {
            me: me
        } )
        
    }
    
    var isCheckName = false
    var key
    
    socket.on( 'message', ( message ) => {
        
        // Line session
        if( isCheckName || message.toLowerCase().indexOf( 'line' ) !== -1 && message.indexOf( '教' ) !== -1 ){
            
            if( !isCheckName ){
                key = message.replace( /[LINE|教えて|ちゃん|！|!]/g, '' )
                io.sockets.to( socket.id ).emit( 'message', 'あなたの名前は？' )
                isCheckName = true
            } else {
                
                 // require('crypto').createHash('md5').update(Date(), 'buffer').digest('hex')
                var value = message
                console.log('http://calmery.me/postNameData.php?key=' + encodeURI( key ) + '&value=' + encodeURI( message ) + '&lat=' + '35.7126775' + '&lon=' + '139.761989')
                request.get( 'http://calmery.me/postNameData.php?key=' + encodeURI( key ) + '&value=' + encodeURI( message ) + '&lat=' + '35.7126775' + '&lon=' + '139.761989', function( error, response, body ){
                    if( !error ){
                        io.sockets.to( socket.id ).emit( 'message', message + 'さん！<br>LINEで「召喚！' + key + '」とメッセージを送ってね' )
                    }
                } )
                
                isCheckName = false
                
            }
            
        } else {
        
            console.log( 'Send Message to UserLocal' )
            request.get( config.message.base + config.message.endPoint.chat + '?message=' + encodeURI( message ) + '&key=' + config.message.key, ( error, response, body ) => {
                console.log( 'Get Message from UserLocal' )
                if( !error && response.statusCode == 200 ){
                    var responseMessage = JSON.parse( body ).result
                    
                    if( me.personality !== 'ojousama' ){
                        /*
                        console.log( config.message.base + config.message.endPoint.character + '?message=' + encodeURI( responseMessage ) + '&key=' + config.message.key + '&character_type=' + me.personality)
                        request( config.message.base + config.message.endPoint.character + '?message=' + encodeURI( responseMessage ) + '&key=' + config.message.key + '&character_type=' + me.personality, ( error, response, body ) => {
                            if( !error && response.statusCode == 200 ){
                                io.sockets.to( socket.id ).emit( 'message', JSON.parse( body ).result )
                            }
                        })
                        */
                        
                        if( me.personality === 'cat' ) responseMessage += 'にゃん！'
                        else responseMessage += 'わん！'
                        io.sockets.to( socket.id ).emit( 'message', responseMessage )
                        
                    } else if( me.personality === 'ojousama' ){
                        responseMessage = responseMessage.replace( /[?|？|!|！]/g, '' )
                        responseMessage += 'ですわ'
                        io.sockets.to( socket.id ).emit( 'message', responseMessage )
                    }
                }
            } )
        
        }
    } )
    
    socket.on( 'capture', ( raw ) => {
        const path = utility.fixPath( __dirname, 'tmp', 'captured.png' )
        fs.writeFile( path, utility.decodeBase64Image( raw ).data, function( error ){ 
            if( !error )
                console.log( 'Saved : tmp/captured.png' )
        } )
    } )
    
    socket.on( 'iconCapture', ( raw ) => {
        const path = utility.fixPath( __dirname, 'tmp', 'icon.png' )
        fs.writeFile( path, utility.decodeBase64Image( raw.data ).data, function( error ){ 
            if( !error ){
                console.log( 'Saved : tmp/icon.png' )
                console.log(raw.r)
                console.log(raw.g)
                console.log(raw.b)
                var hue = require('onecolor')('rgba(' + raw.r + ',' + raw.g + ',' + raw.b + ',1)').hsv()._hue * 360
                console.log(hue)
                checkType(hue)
            }
        } )
    } )
    
} )
