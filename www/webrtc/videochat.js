navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia

var localStream,
    connectedCall 

var peer = new Peer( { 
    key: 'b0133f7e-ef15-42fa-ae2a-92771f4d9e85', 
    debug: 3
} )

peer.on( 'open', function(){
    document.getElementById( 'myId' ).innerHTML = peer.id
} )

peer.on( 'call', function( call ){
    connectedCall = call
    document.getElementById( "peerId" ).innerHTML = call.peer
    call.answer( localStream )
    call.on( 'stream', function( stream ){
        var url = URL.createObjectURL( stream )
        document.getElementById( 'peerVideo' ).src = url
    } )
} )

onload = function(){
    
    navigator.getUserMedia( {
        audio: true, 
        video: true
    }, function( stream ){
        localStream = stream
        // var url = URL.createObjectURL( stream )
        // document.getElementById( 'my-video' ).src = url
    }, function(){ 
        console.log( 'Error' ) 
    } )

    document.getElementById( 'callStart' ).addEventListener( 'click', function(){
        var peer_id = document.getElementById( 'peerIdInput' ).value
        var call = peer.call( peer_id, localStream )
        call.on( 'stream', function( stream ){
            document.getElementById( "peerId" ).innerHTML = call.peer
            var url = URL.createObjectURL( stream )
            document.getElementById( 'peerVideo' ).src = url
            document.getElementById( 'peerVideo' ).src = url
        } )
    } )

    document.getElementById( 'callEnd' ).addEventListener( 'click', function(){
        connectedCall.close()
    } )
}