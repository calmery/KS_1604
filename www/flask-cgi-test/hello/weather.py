import requests
from pprint import pprint

def weather_json(lat, lon):
    OPEN_WEATHER_APP_ID = '5e0eb85e4318057a5513b2f9fc59e9b4'    #API_KEY
    OPEN_WEATHER_URL = 'http://api.openweathermap.org/data/2.5/weather' #API_URL

    payload = {'lat': lat, 'lon': lon, 'mode': 'json', 'units': 'metric', 'APPID': OPEN_WEATHER_APP_ID}
    response = requests.get(OPEN_WEATHER_URL, params=payload)
    return response.json()
