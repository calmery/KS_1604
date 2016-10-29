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