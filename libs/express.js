const http = require( 'http' )

const express = require( 'express' ),
      app     = express()

const utility = require( './utility' )

module.exports.run = () => {
    
    // Run
    const server = http.Server( app )

    // Application is using random port. So get a port number.
    const port = server.listen().address().port
    console.log( 'Running app on localhost:' + port )
    
    app.use( '/icon', function( request, response ){
        response.sendFile( utility.fixPath( __dirname, '..', 'tmp', 'captured.png' ) )
    } )
    app.use( express.static( utility.fixPath( __dirname, '..', 'static' ) ) )

    return {
        port: port,
        http: server
    }

}