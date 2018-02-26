import paho.mqtt.client as mqtt
import BTcar
import sys
HOST,PORT= sys.argv[1],sys.argv[2]
class CarClient:
    def __init__(self):
        self.car=BTcar.BTcar()
        self.client = mqtt.Client()
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message

    # The callback for when the client receives a CONNACK response from the server.
    def on_connect(self,client, userdata, flags, rc):
        print("Connected with result code "+str(rc))
        self.car.connect()
        # Subscribing in on_connect() means that if we lose the connection and
        # reconnect then subscriptions will be renewed.
        self.client.subscribe("ASST/carinp")

    # The callback for when a PUBLISH message is received from the server.
    def on_message(self,client, userdata, msg):
        print(msg.topic+" "+str(msg.payload))
        self.car.sendMsg(str(msg.payload))

    def connect(self):
        self.client.connect(HOST, port=PORT, keepalive=60)
        self.client.loop_forever()
#client = mqtt.Client()
#client.on_connect = on_connect
#client.on_message = on_message

#client.connect("192.168.0.88", port=9010, keepalive=60)


    # Blocking call that processes network traffic, dispatches callbacks and
    # handles reconnecting.
    # Other loop*() functions are available that give a threaded interface and a
    # manual interface#.
#client.loop_forever()

print HOST,PORT
cl=CarClient()
cl.connect()
