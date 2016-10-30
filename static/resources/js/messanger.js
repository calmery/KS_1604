var opponentStartTag = '<div class="line clearfix"><div class="message float_l"><div class="message-icon"><div class="icon" style="background: url( icon ); background-size: cover"></div></div><div class="message-message">'
var opponentEndTag = '</div></div></div>'

var myStartTag = '<div class="line clearfix"><div class="message clearfix me float_r"><div class="message-message">'
var myEndTag = '</div><div class="message-icon"><div class="icon" style="background: url( resources/my.jpg ); background-size: cover"></div></div></div></div>'

var chatArea = document.getElementById( 'chatArea' ),
    input    = document.getElementById( 'input' ),
    unfocus  = document.getElementById( 'unfocus' ),
    sendBtn  = document.getElementById( 'sendBtn' )

// Messanger

function getMessage(){
    if( input.value[input.value.length-1] === '\n' ) input.value = input.value.slice( 0, input.value.length-1 )
    return input.value
}

function resetMessage(){
    input.value = ''
}

function sendMessage(){
    if( getMessage() ){
        chatArea.innerHTML += myStartTag + getMessage() + myEndTag
        socket.emit( 'message', getMessage() )
        resetMessage()
    }
}

// events

document.getElementById( 'input' ).addEventListener( 'keyup', function( e ){
    if( e.keyCode === 13 ){
        sendMessage()
    }
} )

socket.on( 'message', function( message ){
    chatArea.innerHTML += opponentStartTag + message + opponentEndTag
} )

var speech = new webkitSpeechRecognition()
speech.lang = 'ja'

var toggleBtn = document.getElementById( 'toggleBtn' ),
    isRecoding = false

toggleBtn.addEventListener( 'click', function(){
    if( !isRecoding ){
        console.log( 'Start' )
        speech.start()
        isRecoding = true
    } else {
        console.log( 'Stop' )
        speech.stop()
        isRecoding = false
    }
} )

speech.onsoundstart = function(){
    console.log('asdasd')
};

speech.onresult = function(e){
    console.log( 'Result : ' + e.results[0][0].transcript )
    var result = e.results[0][0].transcript
    chatArea.innerHTML = result
    sendMessage()
}

speech.onerror= function(e){
    console.log(e)
};