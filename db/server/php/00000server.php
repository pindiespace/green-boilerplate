<?php 

class GBP_SERVER_PHP_DETECTORS { 

public function __construct() {}

public function useragent () 
{
	return strtolower(@php_uname("a"));
}

public function ip ()
{
	if(!empty($_SERVER['HTTP_CLIENT_IP']))               //check ip from share internet
	{
		$ip_addr =$_SERVER['HTTP_CLIENT_IP'];
	}
	else if(!empty($_SERVER['HTTP_X_FORWARDED_FOR']))   //to check ip is pass from proxy
	{
		$ip_addr = $_SERVER['HTTP_X_FORWARDED_FOR'];
	}
	else
	{
		$ip_addr = $_SERVER['REMOTE_ADDR'];
	}
	if(strlen($ip_addr) > 0)
	{
		return filter_var(trim($ip_addr), FILTER_VALIDATE_IP);
	}
return 'undefined';
}
	

public function cpuload ()
{
	if(@file_exists("/proc/stat"))
	{
		$cpu_str = file_get_contents("/proc/stat");
		if(!empty($cpu_str))
		{
			sscanf($data, "%*s %Ld %Ld %Ld %Ld", $a, $b, $c, $d);
			$load = $a + $b + $c;
			$total = $a + $b + $c + $d;
			return round((100*($load)) / ($total));
		}
	}
	return "undefined";
}

public function domainname ()
{ 
	$ip_addr = filter_var($_SERVER["SERVER_ADDR"], FILTER_VALIDATE_IP); //server IP
	$ptr= implode(".",array_reverse(explode(".",$ip_addr))).".in-addr.arpa";
	$host = dns_get_record($ptr, DNS_PTR);
	if ($host == null)
	{
		return trim($ip_addr);
	}
			
	return trim($host[0]["target"]);
}

public function hardware () 
{
	$data_arr = explode(" ", strtolower(@php_uname("a")));
	$num_tokens = count($data_arr);
			
	if($num_tokens > 3)
	{
		return $data_arr[$num_tokens - 1];		
	}

	return "undefined";
}

public function memory ()
{
	if(@file_exists("/proc/meminfo"))
	{
		$mem_str = preg_split("/[\n]+/", shell_exec("cat /proc/meminfo"));
		if(!empty($mem_str))
		{
			$memtotal = trim(array_pop(explode(":",$mem_string[3])));
			$memfree  = trim(array_pop(explode(":",$mem_string[4])));
			if($memtotal > 0)
			{
				return $memfree/$memtotal;
			}
		}
	}
	return "undefined";
}

public function os () 
{
	$data_arr = explode(" ", strtolower(@php_uname("a")));
	$num_tokens = count($data_arr);	
	if($num_tokens > 0)
	{
		$os = $data_arr[0];
	}	
	if($num_tokens > 2 && $data_arr[1] == "nt")
	{
		$os .= $data_arr[1];        //windows nt
	}
	if(isset($os))
	{
		return $os;
	}
	return "undefined";
}

public function osversion () 
{
	$data_arr = explode(" ", strtolower(@php_uname("a")));
	$num_tokens = count($data_arr);
			
	if($num_tokens > 2 && $data_arr[1] == 'nt')
	{
		$osvers .= $data_arr[3];        //windows nt
	}
	else
	{
		$osvers = $data_arr[2];
	}

	if(isset($osvers))
	{
		return $osvers;
	}

	return "undefined";
}

public function software () 
{
$software = filter_var($_SERVER["SERVER_SOFTWARE"], FILTER_SANITIZE_STRING);
if(isset($software))
{
return $software;
}

return "undefined";

}

public function spdy () 
{
	if(isset($_SERVER["ALTERNATE_PROTOCOL"]))
	{
		$prot = filter_var($_SERVER["ALTERNATE_PROTOCOL"], FILTER_SANITIZE_STRING);
		if(strpos($prot, "spdy") !== false)
		{
			return true;
		}
	}
	return false;
}

public function timestamp () 
{
	$timestamp = filter_var($_SERVER["REQUEST_TIME"], FILTER_SANITIZE_STRING); //timestamp from start of request
	if(isset($timestamp))
	{
		return $timestamp;
	}

	return "undefined"; 
}


};