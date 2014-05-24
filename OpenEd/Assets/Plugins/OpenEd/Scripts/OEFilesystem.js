#pragma strict

import System.IO;

public class OEFolder {
	public var name : String;
	public var subfolders : OEFolder[];

	public function GetFolderFromPath ( path : String ) : OEFolder {
		var result : OEFolder = this;
		
		if ( path.Length > 1 ) {
			var names : String[] = path.Split ( "/"[0] );
			var prev : OEFolder;

			for ( var i : int = 0; i < names.Length; i++ ) {
				if ( !result ) {
					result = prev;
					break;
				
				} else {
					prev = result;
					result = result.GetSubfolder ( names[i] );
				
				}
			}
		}
		
		if ( !result ) {
			result = prev;
		}

		return result;
	}

	public function GetSubfolder ( name : String ) : OEFolder {
		for ( var i : int = 0; i < subfolders.Length; i++ ) {
			if ( name == subfolders[i].name ) {
				return subfolders[i];
			}
		}

		if ( name == this.name ) {
			return this;
		}

		return null;
	}

	public function GetSubfolderNames () : String [] {
		var tmp : List.< String > = new List.< String > ();

		for ( var i : int = 0; i < subfolders.Length; i++ ) {
			tmp.Add ( subfolders[i].name );
		}

		return tmp.ToArray ();
	}

	public function HasChild ( folder : OEFolder ) : boolean {
		for ( var i : int = 0; i < subfolders.Length; i++ ) {
			if ( folder == subfolders[i] ) {
				return true;
			}
		}

		return false;
	}
}
	
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
