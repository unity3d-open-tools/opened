#pragma strict

import System.IO;

public class OEFileSystem {
	public static function GetFiles ( path : String ) : FileInfo [] {
		var info : DirectoryInfo = new DirectoryInfo ( path );
		return info.GetFiles ();
	}

	public static function GetFolders ( path : String ) : DirectoryInfo [] {
		var info : DirectoryInfo = new DirectoryInfo ( path );
		return info.GetDirectories ();
	}

	public static function GetResources ( path : String, type : System.Type ) : Object[] {
		return Resources.LoadAll ( path, type );
	}

	public static function GetParentFolder ( path : String ) : DirectoryInfo {
		return Directory.GetParent ( path );
	}
}
