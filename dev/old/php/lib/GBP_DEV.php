<?php

class GBP_DEV extends GBP_DEV_BASE {


	/** 
	 * constructor
	 */
	 public function __construct()
	{
	 	parent::__construct();
	}
	
	
	/**
	 * @method scan_for_files
	 * get a directory list
	 * @param {String} $path directory
	 * @param {Array} $ext file extension(s) to look for
	 */
	private static function scan_for_files($path, $ext='')
	{
		$files = array();
		$dir   = opendir($path);
		
		while(($filename = readdir($dir)) !== false) 
		{			
			if(!is_dir($filename))
			{
				$files[] = $filename;
			}
		}
		
		//only grab files with the correct extension
		
		if(!empty($ext))
		{
			$groups = glob($files.$ext);
		}
		
		if(!count($files))
		{
			return false;
		}
		
		sort($files);

		return $files;
	}

	
	/**
	 * @method get_file_list() 
	 * get the native DB files for GBP-Tools (PHP array)
	 * @param {String} $db_path absolute path to database files
	 * @param {String} $ext file extension filter (get all files if empty)
	 * @returns {Array|false} if ok, return array with filenames, else false
	 */
	public static function get_file_list($db_path, $ext)
	{
		if(is_dir($db_path))
		{
			$db_list = self::scan_for_files($db_path, $ext);
			
			if(!count($db_list))
			{
				self::set_error(__METHOD__, "No files ($ext) in path $db_path");
				self::print_error_json();
				return false;
			}
		}
		
		return $db_list;
	}

	
}; //end of class

