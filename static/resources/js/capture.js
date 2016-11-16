var video  = document.getElementById( 'video' ),
    canvas = document.getElementById( 'capture' ),
    ctx    = canvas.getContext( '2d' )

var canvasIcon = document.getElementById( 'icon' ),
    ctxIcon    = canvasIcon.getContext( '2d' )

canvas.width  = 640
canvas.height = 480

canvasIcon.width  = 200
canvasIcon.height = 200

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
    ctx.drawImage( video, 0, 0, canvas.width, canvas.height )
    socket.emit( 'capture', canvas.toDataURL( 'png' ) )
    iconCapture()
}

function iconCapture(){
    var imageData = ctx.getImageData( 0, 0, canvas.width, canvas.height )
    ctxIcon.putImageData( ctx.getImageData( (canvas.width - canvasIcon.width)/2, (canvas.height - canvasIcon.height)/2, canvasIcon.width, canvasIcon.height ), 0, 0 )  
    var iconData = ctxIcon.getImageData( 0, 0, canvasIcon.width, canvasIcon.height ).data
    var r = 0, g = 0, b = 0
    for( var i=0; i<canvasIcon.height*canvasIcon.width; i++ ){
        r += iconData[0 + 4 * i]
        g += iconData[1 + 4 * i]
        b += iconData[2 + 4 * i]
    }
    r /= canvasIcon.height*canvasIcon.width
    g /= canvasIcon.height*canvasIcon.width
    b /= canvasIcon.height*canvasIcon.width
    socket.emit( 'iconCapture', {
        data: canvasIcon.toDataURL( 'png' ),
        r: r,
        g: g,
        b: b
    } )
}

socket.on( 'setupComplated', function( obj ){
    chatSession.style.display = 'block'
    captureSession.style.display = 'none'
    console.log( obj )
} )