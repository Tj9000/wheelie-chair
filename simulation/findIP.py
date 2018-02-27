import os, re, threading
import socket
import ipaddress

class ip_check(threading.Thread):
   def __init__ (self,ip):
      threading.Thread.__init__(self)
      self.ip = ip
      self.__successful_pings = -1
   def run(self):
      ping_out = os.popen("ping -q -c2 "+self.ip,"r")
      while True:
        line = ping_out.readline()
        if not line: break
        n_received = re.findall(received_packages,line)
        if n_received:
           self.__successful_pings = int(n_received[0])
   def status(self):
      if self.__successful_pings == 0:
         return "no response"
      elif self.__successful_pings == 1:
         return "alive, but 50 % package loss"
      elif self.__successful_pings == 2:
         return "alive"
      else:
         return "shouldn't occur"

received_packages = re.compile(r"(\d) received")
def getIPs():
  s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
  s.connect(("8.8.8.8", 80))
  ip=s.getsockname()[0]
  net_addr=ip.split('.')[:3]
  net_addr='.'.join(net_addr)+'.'
  # net_addr=u'.'.join(net_addr) + u'/24'
  s.close()

  # ip_net = ipaddress.ip_network(net_addr)
  # all_hosts = list(ip_net.hosts())
  onlineHosts=[]
  check_results = []
  for i in range(1,254):
    ip = net_addr+str(i)
    # ip = str(host)
    current = ip_check(ip)
    check_results.append(current)
    current.start()

  for el in check_results:
    el.join()
    if(el.status() == 'alive'):
      onlineHosts.append(el.ip)
  return onlineHosts


# output = subprocess.Popen(['ping', '-c', '1', str(all_hosts[i])], stdout=subprocess.PIPE, startupinfo=info).communicate()[0]
#     if "DESTINATION HOST UNREACHABLE" in output.decode('utf-8').upper():
#       pass
#     elif "REQUEST TIMED OUT" in output.decode('utf-8').upper():
#       pass
#     else:
#       onlineHosts.append(str(all_hosts[i]))