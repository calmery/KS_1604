const fs   = require( 'fs' ),
      path = require( 'path' )

// Additional modules
const JsYaml = require( 'js-yaml' )

// Utility
const Util = require( '../libs/utility' )

// yamlParser :: String -> Object
const yamlParser = ( path ) => JsYaml.safeLoad( fs.readFileSync( Util.fixPath( __dirname, path ), 'utf8' ) )

var config

const update = function(){
    config = {}
    
    config = {
        electron: yamlParser( 'config/electron.yaml' ),
        message: yamlParser( 'config/message.yaml' )
    }
    
    module.exports.config = config
    return config
}

update()

module.exports.update = update