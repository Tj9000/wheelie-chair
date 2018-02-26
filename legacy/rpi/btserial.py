import serial
from time import sleep
 
bluetoothSerial = serial.Serial( "/dev/rfcomm30", baudrate=9600 )
 
count = None
while count == None:
    try:
        count = int(raw_input( "Please enter the number of times to blink the LED: "))
        wait = int(raw_input( "Please enter the time to wait(seconds): "))
    except:
        pass    # Ignore any errors that may occur and try again
 
 
bluetoothSerial.write( "LED "+str(count)+","+str(wait) )
print bluetoothSerial.readline()
