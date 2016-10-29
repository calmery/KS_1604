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
    
}