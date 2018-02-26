import bluetooth

serverMACAddress = '30:14:06:16:10:45'
port = 1
s = bluetooth.BluetoothSocket(bluetooth.RFCOMM)
s.connect((serverMACAddress, port))
print "Commected. Enter Messages to send"
while 1:
    text = raw_input()
    if text == "quit":
            break
    s.send(text)

s.close()

def searchDev():
	devices = bluetooth.discover_devices(duration = 5, lookup_names = True)
	for dev in devices:
		print dev
