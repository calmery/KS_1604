var video  = document.getElementById( 'video' ),
    canvas = document.getElementById( 'capture' ),
    ctx    = canvas.getContext( '2d' )

canvas.width  = 640
canvas.height = 480

navigator.webkitGetUserMedia( {
    video: true, 
    audio: false
}, function( localMediaStream ){
    video.style.display = 'block'
    video.src = window.URL.createObjectURL( localMediaStream )
    video.play()
}, function(){
    console.log( 'Error' )
} )

function capture(){
    ctx.drawImage( video, 0, 0, 640, 480 )
    socket.emit( 'capture', canvas.toDataURL( 'png' ) )
}

socket.on( 'setupComplated', function( obj ){
    chatSession.style.display = 'block'
    captureSession.style.display = 'none'
    console.log( obj )
} )