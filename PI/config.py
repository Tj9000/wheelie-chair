import sys
import random
import json
vehicleData = json.load(open('PI/vehicleData.json'))

arglen = len(sys.argv)
if len(sys.argv) == 2 and sys.argv[1] == 'help' :
	print("usage: npm run pi-config")
	print("npm run pi-config -- [ uid [ type [ location [ status [ position ] ] ] ] ]")
	sys.exit(0)

vId			=	sys.argv[1] if(arglen>1) else '100'+str(random.randint(100000,999999))
vType		=	sys.argv[2] if(arglen>2) else random.choice(vehicleData["type"])
vLoc		=	sys.argv[3] if(arglen>3) else random.choice(vehicleData["location"])
vStatus		=	sys.argv[4] if(arglen>4) else random.choice(vehicleData["status"])
vPosition	=	sys.argv[5] if(arglen>5) else random.choice(vehicleData["position"])

print "configured vehicle with: "
print vId,vType,vLoc,vStatus,vPosition

fileinp=[] 
config='{'
config+=' "uid" : "' + vId				+ '" ,'
config+=' "type" : "' + vType			+ '" ,' 
config+=' "location" : "' +  vLoc		+ '" ,'
config+=' "status" : "' +  vStatus		+ '" ,'
config+=' "position" : "' +  vPosition	+ '" '
config+='}'

fp = open("PI/CONFIG.json","w")
fp.write(config)
fp.close() 