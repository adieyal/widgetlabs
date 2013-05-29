import sys
import urllib2
from lxml import etree
from StringIO import StringIO

input = sys.argv[-1]
stream = open(input, 'r')

document = etree.parse(stream)
body = etree.tostring(document)

url = 'http://widgetlabs.acscomputers.co.za/inkscape/'
request = urllib2.Request(url)
request.add_header('Content-Type', 'application/x-www-form-urlencoded') #'image/svg+xml; charset=UTF-8',
request.add_header('Content-Length', '%d' % (len(body)))
request.add_data(body)
response = urllib2.urlopen(request)

if response.getcode() == 200:
    document = etree.parse(response)
    document.write(sys.stdout)
else:
    sys.stderr.write('An error was reported from the WidgetLabs server.\n')
    sys.stderr.write(response.read())

sys.stdout.flush()
sys.stderr.flush()
sys.exit(0)
