navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var localStream; 
var connectedCall; 

var peer = new Peer({ key: 'b0133f7e-ef15-42fa-ae2a-92771f4d9e85', debug: 3});

peer.on('open', function(){
    document.getElementById('my-id').innerHTML = peer.id;
});
peer.on('call', function(call){
    connectedCall = call;
    document.getElementById("peer-id").innerHTML = call.peer;
    call.answer(localStream)
    call.on('stream', function(stream){
        var url = URL.createObjectURL(stream);
        document.getElementById('peer-video').src = url;
    });
});

onload = function(){
    navigator.getUserMedia({audio: true, video: true}, function(stream){
        localStream = stream;
        var url = URL.createObjectURL(stream);
        document.getElementById('my-video').src = url;

    }, function() { alert("Error!"); });

    document.getElementById('call-start').addEventListener( 'click', function(){
        var peer_id = document.getElementById('peer-id-input').value;
        var call = peer.call(peer_id, localStream);
        call.on('stream', function(stream){
            document.getElementById("peer-id").innerHTML = call.peer;
            var url = URL.createObjectURL(stream);
            document.getElementById('peer-video').src = url;
        });
    })

    document.getElementById('call-end').addEventListener('click', function(){
        window.location.back();
        connectedCall.close();
    });
}