import bluetooth
#import threading

class BTcar:
    def __init__(self):
        self.carMAC= '30:14:06:16:10:45'
        self.port = 1
        self.s = bluetooth.BluetoothSocket(bluetooth.RFCOMM)
        self.s.connect((self.carMAC, self.port))
        #t1 = threading.Thread(target=self.recvMsg)
        #t1.start()
    def sendMsg(self,msg):
        self.s.send(msg)
        data = self.s.recv(1024)
        if(data):
               print data
    def connect(self):
        self.s.send("InitCarASSTauth00010")
    def disconnect(self):
        self.s.send("exit")
    def __del__(self):
        self.disconnect()
        self.s.close()
    def recvMsg(self):
        while True:
            data = self.s.recv(1024)
            if(data):
                print data
