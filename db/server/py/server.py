#!/usr/bin/env python

import sys
import platform
import os
import socket
import re
import subprocess
import json


# ----------------------------
# SERVER.PY
# 
# demonstrates running python server-side 
# scripts from GBP bootstrap
# Pete Markiewicz 5/2014
#
# NOTE: if server. property names are changed 
# they have to be changed manually here
#
# ----------------------------


# ----------------------------
# QUALIFIED HOSTNAME
# ----------------------------
	
def get_hostname():
	if socket.gethostname().find('.')>=0:
		return socket.gethostname()
	else:
		return socket.gethostbyaddr(socket.gethostname())[0]	


# ----------------------------
# SERVER IP ADDRESS
# http://stackoverflow.com/questions/11735821/python-get-localhost-ip
# ----------------------------

def get_interface_ip(ifname):
	s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
	return socket.inet_ntoa(fcntl.ioctl(s.fileno(), 0x8915, struct.pack('256s',
                                ifname[:15]))[20:24])

def get_lan():
	if os.name != "nt":
		import fcntl
		import struct
	
	networktype = 'eth0'
	
	ip = socket.gethostbyname(socket.gethostname())
	
	# if we get back the localhost ip, get the LAN address
	
	if ip.startswith("127.") and os.name != "nt":
		interfaces = [
		"eth0",
		"eth1",
		"eth2",
		"wlan0",
		"wlan1",
		"wifi0",
		"ath0",
		"ath1",
		"ppp0",
		]
		
		for indx, ifname in interfaces:
			try:
				ip = get_interface_ip(ifname)
				networktype = indx
				break
			except IOError:
               			return None
		
	return {
		'networktype' : networktype,
		'ip' : ip
		}


# ----------------------------
# CPUCOUNT
# ----------------------------

def get_cpucount():
	# cpuset
	# cpuset may restrict the number of *available* processors
	try:
		m = re.search(r'(?m)^Cpus_allowed:\s*(.*)$',
			open('/proc/self/status').read())
		if m:
			res = bin(int(m.group(1).replace(',', ''), 16)).count('1')
			if res > 0:
				return res
	except IOError:
		pass

	# Python 2.6+
	try:
		import multiprocessing
		return multiprocessing.cpu_count()
	except (ImportError, NotImplementedError):
        	pass

	# http://code.google.com/p/psutil/
	try:
		import psutil
		return psutil.NUM_CPUS
	except (ImportError, AttributeError):
		pass
		
	return 'undefined'


# ----------------------------
# MEMORY
# ----------------------------

def get_mem():
	import resource
	rusage_denom = 1024.
	if sys.platform == 'darwin':
		# ... it seems that in OSX the output is different units ...
		rusage_denom = rusage_denom * rusage_denom
	mem = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss / rusage_denom
	return mem


# ----------------------------
# SERVER GEOLOCATION
# if you have control of your server, you could use MaxMind GeoIP
# full web services description at
# http://dev.maxmind.com/geoip/legacy/web-services/
# python example shown on this page
# http://dev.maxmind.com/geoip/geoip2/web-services/
# https://pypi.python.org/pypi/geoip2
# 
# another module
# Google Geocoding API V3
# https://pypi.python.org/pypi/pygeocoder/1.2.4
#
# http://dev.maxmind.com/geoip/geoip2/web-services/
# 
# API used here for those who can't install a gelocation module
# http://stackoverflow.com/questions/2543018/what-python-libraries-can-tell-me-approximate-location-and-timezone-given-an-ip
#
# format for returned data (GBP address)
# server['serveraddress']['city']
# server['serveraddress']['state']
# server['serveraddress']['country']
# server['serverlocation']['latitude']
# server['serverlocation']['longitude']
# ----------------------------

def get_geolocation(ip):

	# --------------------------
	# define keys for geolocation APIs
	# here
	# --------------------------

	mymaxmindkey = '0'
	geo = []
	
	try:
		import urllib
	except (ImportError, NotImplementedError):
		return None

	# if we passed an ip, try getting geodata from an API
	
	if ip != None:
	
		try:
			# this API uses the MaxMind data with some additions (no key required)
			# http://www.geoplugin.com/webservices/json
			
			result = urllib.urlopen('http://www.geoplugin.net/json.gp?' + ip + '&jsoncallback=').read()
			
			geo = json.loads(result)
			
			return {
				'city' : geo['geoplugin_city'],
				'state' : geo['geoplugin_regionName'],
				'country' : geo['geoplugin_countryName'],
				'latitude' : geo['geoplugin_latitude'],
				'longitude' : geo['geoplugin_longitude']
			}
				

		except (ImportError, NotImplementedError):
			pass
	
		try:
			# Free Geoip (no key required)
			# http://freegeoip.net/
			
			result = urllib.urlopen('http://freegeoip.net/json/' + ip).read()
			
			geo = json.loads(result)
			
			return {
				'city' : geo['city'],
				'state' : geo['region_name'],
				'country' : geo['country_name'],
				'latitude' : geo['latitude'],
				'longitude' : geo['longitude']
			}
		except:
			pass


		try:
		
			# MaxMind API (paid service, api key required)
			# documentation at: http://dev.maxmind.com/geoip/geoip2/web-services/
			
			if len(mymaxmindkey) > 2:
				result = urllib.urlopen('http://api.geoips.com/ip/' + ip + '/key/' + mymaxmindkey + '/output/json').read()
				geo = json.loads(result)
				return geo

		except:
			pass

	return None


# ----------------------------
# SERVER TIMESTAMP
# ----------------------------	
	
def get_timestamp():

	import time
	
	return time.time()
	
	
# ----------------------------
# MAIN PROGRAM
# ----------------------------

# check if we're being run directly, or being imported

if __name__ == "__main__":
	

	# we need the ip address for several other tests
	
	serverlan = get_lan()
	
	# check the incoming list of arguments to see which operations to run
	
	for arg in sys.argv:
    		if arg == 'geolocation':
			location = get_geolocation(serverlan['ip'])		

	# create a JSON string for output
		
	locationstr = "{"
	
	for(indx, val) in location.items():
		locationstr += "\"" + indx + "\"" + " : \"" + val + "\", "
		
	locationstr += "}"
	
	print(locationstr)
	print ("bob")
	
	print("{" + "\"servercpunum\"" + " : \"" + str(get_cpucount()) + "\", " + 
		"\"servermemory\"" + " : \"" + str(get_mem()) + "\", " + 
		"\"serverdomainname\"" + " : \"" + get_hostname() + "\", " + 
		"\"serverip\"" + " : \"" + serverlan['ip'] + "\", " + 
		"\"servertimestamp\"" + " : \"" + str(get_timestamp()) + "\", " + 
		"\"serveros\"" + " : \"" + platform.system().lower() + "\", " + 
		"\"serverosversion\"" + " : \"" + platform.release() + "\", " + 
		"\"serverbits\"" + " : \"" + platform.architecture()[0] + "\", " + 
		"\"serverhardwaretype\"" + " : \"" +  platform.machine() + "\", " + 
		"\"geolocation\"" + " : \"" + locationstr  + "\" " + 
		"}"
		)
	

	#for (indx, val) in location.items():
    	#	print indx, val
	

	
	
		