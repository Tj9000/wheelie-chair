import paho.mqtt.client as mqtt
import BTvehicle
import sys
import socket
import ipaddress
import threading
import time
import sys
import json
import Queue
sys.path.append('./assets')

import findIP
#from ImgPr import camClient

vehicleData = json.load(open('PI/CONFIG.json'))
uid     = vehicleData["uid"]
typ     = vehicleData["type"]
loc     = vehicleData["location"]
status  = vehicleData["status"]
pos     = vehicleData["position"]

VehiDetailArg=','.join([uid,typ,loc,status,pos])
class CarClient:
    def __init__(self):
        self.q=Queue.Queue()
        self.vehi=BTvehicle.BTvehicle(self.q)
        self.PORT=10250
        self.HOST=False
        while not self.HOST:
            self.HOST=self.findHost()
            time.sleep(5)
        if(self.HOST=='103'):
            print("Connected to remoteCloud")
        self.client = mqtt.Client()
        self.client.connect(self.HOST,port=self.PORT,keepalive=1)
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message

    # The callback for when the client receives a CONNACK response from the server.
    def on_connect(self,client, userdata, flags, rc):
        print("Connected with result code "+str(rc))
        # Subscribing in on_connect() means that if we lose the connection and reconnect then subscriptions will be renewed.
        self.client.subscribe("ASST/"+uid)
        #self.client.publish("ASST/"+uid,"Testing")
        # self.vehi.connect() #currently dont in init itsef

    # The callback for when a PUBLISH message is received from the server.
    def on_message(self,client, userdata, msg):
        print(msg.topic+" "+str(msg.payload))
        self.msgParser(msg.payload)

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
                print('HOST selected: ',i)
                return str(i)
            except:
                pass
        try:
            self.serveClient.connect('127.0.0.1', port=self.PORT, keepalive=1)
            self.serveClient.publish('register',VehiDetailArg, qos=1)
            print('HOST selected: 127.0.0.1')
            return '127.0.0.1'
        except:
            return False
    def msgParser(self,msg):
        print("msgParser:",msg)
        if msg=='START_CAM':
            self.startCam()
        elif msg=='STOP_CAM':
            self.stopCam()
            pass
        else:
            m=msg.split()
            if len(m)==1:
                self.vehi.sendMsg(msg,False)
                x=self.q.get()
                print("Done.")
            else:
                for index,i in enumerate(m):
                    self.vehi.sendMsg(i,True)
                    #if(index==len(m)-1):
                    #    break;
                    x=self.q.get()
                    print("Done :",i)
            updMsg=uid+',REACHED'
            self.client.publish("updateMessages",updMsg,qos=1)
            print("Updated Position")


    def startCam(self):
        self.camClient=camClient.ImageReader()
        self.camClient.start()
    def stopCam(self):
        self.camClient.stop()


        


print(uid,typ,loc,status,pos)

cl=CarClient()
cl.connect()
print("done")
