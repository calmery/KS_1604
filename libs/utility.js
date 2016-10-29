const fs   = require( 'fs' ),
      path = require( 'path' )

module.exports = {
    
    isExist: ( file ) => {
        try {
            fs.statSync( path.resolve( file ) )
            return true
        } catch( error ){
            // if( error.code === 'ENOENT' )
            return false
        }
    },

    // Create a new path from arguments.
    fixPath: function(){
        return path.resolve( path.join.apply( this, [].slice.call( arguments ) ) )
    },
    
    decodeBase64Image: ( dataString ) => {
        var matches = dataString.match( /^data:([A-Za-z-+\/]+);base64,(.+)$/ ),
            response = {}

        if( matches.length !== 3 )
            return new Error( 'Invalid input string' )

        response.type = matches[1]
        response.data = new Buffer( matches[2], 'base64' )

        return response
    }
    
}