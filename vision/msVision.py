import httplib
import urllib

import sys

file_name = sys.argv[1]

headers = {
    'Content-Type': 'application/octet-stream',
    'Ocp-Apim-Subscription-Key': '264edea3f1d54a2d8d0448fbf085db85',
}
params = urllib.urlencode( {
    'visualFeatures': 'Description',
} )

connect = httplib.HTTPSConnection( 'api.projectoxford.ai' )

img = open( file_name, 'rb' ).read()

connect.request( 'POST', '/vision/v1.0/analyze?%s' % params, img, headers )
response = connect.getresponse()
caption_data = response.read()
connect.close()

print( caption_data )