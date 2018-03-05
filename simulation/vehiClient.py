import paho.mqtt.client as mqtt
#import PIvehicle
import sys
import socket
import ipaddress
import subprocess
import time
import json

import sys
sys.path.append('./assets')
import findIP

uid=sys.argv[1]
typ=sys.argv[2]
loc=sys.argv[3]
status=sys.argv[4]
pos=sys.argv[5]

VehiDetailArg=','.join(sys.argv[1:])
class CarClient:
    def __init__(self):
        #self.car=BTcar.BTcar()
        self.registerComplete=False
        self.PORT=10250
        self.HOST=self.findHost()
        if(self.HOST[:3]=='103'):
            print("connected to remote cloud")
        self.client = mqtt.Client()
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message

    # The callback for when the client receives a CONNACK response from the server.
    def on_connect(self,client, userdata, flags, rc):
        print("Connected with result code "+str(rc))
        # self.car.connect()
        # Subscribing in on_connect() means that if we lose the connection and reconnect then subscriptions will be renewed.
        self.client.subscribe("ASST/"+uid)
        # self.regWithHost();

    # The callback for when a PUBLISH message is received from the server.
    def on_message(self,client, userdata, msg):
        print(msg.topic+" "+str(msg.payload))
        # self.car.sendMsg(str(msg.payload))

    def connect(self):
        self.client.connect(self.HOST, port=self.PORT, keepalive=60)
        self.client.loop_forever()
    def findHost(self):
        print("Finding connected devices")
    	connectedHosts= findIP.getIPs()
    	print(connectedHosts)
    	self.serveClient = mqtt.Client()
    	for i in connectedHosts:
    		try:
    			self.serveClient.connect(i, port=self.PORT, keepalive=1)
    			self.serveClient.publish('register',VehiDetailArg, qos=1)
    			# self.serveclient.on_message = self.on_message_reg
    			# self.serveClient.subscribe("registrationStat/"+uid)		    	
		    	print('HOST selected: ',i)
		    	return str(i)
    		except:
    			pass
    	print('HOST: 127.0.0.1')
    	return '127.0.0.1'
    def regWithHost(self):
    	while(not self.registerComplete):
	    	self.serveClient.publish('register',VehiDetailArg, qos=1)
	    	time.sleep(10)
    def on_message_reg(self,client, userdata, msg):
    	if msg.payload=='ACCEPTED':
            self.registerComplete=True
            print("ACCEPTED by HOST")

print(uid,typ,loc,status,pos)

cl=CarClient()
cl.connect()
print("done")