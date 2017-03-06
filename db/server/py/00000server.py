#!/usr/bin/env python

# ------------------------
# SERVER WORD SIZE
# 32 or 64 bit
# ------------------------

def bits():

	try:
		import platform
		return platform.architecture()[0]

	except (ImportError, NotImplementedError):
		pass

	return 'undefined'



# ----------------------------
# CPUCOUNT
# ----------------------------

def cpunum():

	# cpuset
	# cpuset may restrict the number of *available* processors

	try:
		import re
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
# MAIN PROGRAM
# ----------------------------

if __name__ == "__main__":

	server = {
		'bits' : str(bits()), 
		'cpunum' : str(cpunum()) 
		}
	try:
		import json
		print(json.dumps(server, ensure_ascii=False))
	except (ImportError, AttributeError):
		 print('{}')
