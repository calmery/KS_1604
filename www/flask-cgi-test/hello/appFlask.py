# -*- coding: utf-8 -*-
#!/home/sojo-patchworks/local/python/bin/python3
from flask import Flask, request, abort
import json
import requests
import urllib.parse
from weather import *

from linebot import (
    LineBotApi, WebhookHandler
)
from linebot.exceptions import (
    InvalidSignatureError
)
from linebot.models import (
    MessageEvent, TextMessage, TextSendMessage,
)

app = Flask(__name__)

line_bot_api = LineBotApi('wOq1fV72a9qiUfck9YKsb/3OvZVDNusDvTu3iTYNqT1eZxxa17LG24yMFzT+vQKV0NUkk2rhpTZa3RA2F58V4fhLkt9qYWq/DEy+xs3Z/66M0prHZGutN2ObaZJkQGpqog6ut/lblNlwzZPivTYbFgdB04t89/1O/w1cDnyilFU=')
handler = WebhookHandler('48a925c4588ef8ebdcb55a215b9fa0d7')

@app.route("/callback", methods=['POST'])
def callback():
    # get X-Line-Signature header value
    signature = request.headers['X-Line-Signature']

    # get request body as text
    body = json.loads(request.get_data(as_text=True))
    #raise Exception(body)
    #app.logger.info("Request body: " + body)
    
    if not ("召喚！" in body['events'][0]['message']['text']):
        r = requests.get('https://chatbot-api.userlocal.jp/api/chat?message=' + urllib.parse.quote(body['events'][0]['message']['text']) + '&key=bfdc7c72ab01f54f01d3' )
        line_bot_api.reply_message(body['events'][0]['replyToken'],TextSendMessage(text=json.loads(r.text)['result']))
    elif('天気' in body['events'][0]['message']['text']):
        weather = weather_json(lat='35.7126775', lon='139.761989')
        name = weather['name']
        description = weather['weather']['description']
        main = weather['weather']['main']
        temp_max = weather['main']['temp_max']
        temp_min = weather['main']['temp_min']
        humidity = weather['main']['humidity']
        speed = weather['wind']['speed']
        message = '場所：'+name+'\n天気:'+description+'\n最高気温：'+temp_max+'\n最低気温：'+temp_min+'\n湿度：'+humidity+'\n風速：'+speed
        line_bot_api.reply_message(body['events'][0]['replyToken'], TextSendMessage(text=message))
    else :
        line_bot_api.reply_message(body['events'][0]['replyToken'],TextSendMessage(text=json.loads( requests.get( 'http://calmery.me/getNameData.php' ).text )[body['events'][0]['message']['text'].replace('召喚！', '')] + 'さん！おかえりなさい！'))

    # handle webhook body
    #handler.handle(body, signature)

    return 'OK'


@handler.add(MessageEvent, message=TextMessage)
def handle_message(event):
    line_bot_api.reply_message(
        event.reply_token,TextSendMessage(text='Hello World!'))
