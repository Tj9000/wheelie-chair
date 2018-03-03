import sys
import os
import json
import random
import subprocess
#from pprint import pprint

print(sys.argv)
vehicleData = json.load(open('simulation/vehicleData.json'))
print (os.getcwd())
noOfVehi= int(sys.argv[1]) if len(sys.argv)==2 else 3
vehicles=[]
for i in range(noOfVehi):
	vType		=random.choice(vehicleData["type"])
	vLoc		=random.choice(vehicleData["location"])
	vStatus		=random.choice(vehicleData["status"])
	vPosition	=random.choice(vehicleData["position"])
	vId			='100'+str(i)+str(random.randint(10000,99999))

	vehicles.append([vId,vType,vLoc,vStatus,vPosition])

# print vehicles
newpid= -1
for i in vehicles:
	newpid = os.fork()
	if newpid == 0:  #child
		# subprocess.call("python simulation/vehiClient.py",i)
		try:
			subprocess.call(["gnome-terminal", "-x", "sh", "-c", "python simulation/vehiClient.py "+' '.join(i)+';bash'])
		except:
			subprocess.call(["python","simulation/vehiClient.py"]+i)
		break
		# else:
		# 	sys.exit(0)
if not newpid == 0:
	raw_input()
	print("press enter again to exit")
	raw_input()