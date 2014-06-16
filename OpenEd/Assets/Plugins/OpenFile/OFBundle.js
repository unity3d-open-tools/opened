#pragma strict

public class OFBundle {
	public class Folder {
		public var name : String;
		public var path : String;
		public var subfolders : Folder [] = new Folder [0];
		public var textures : Texture2D [] = new Texture2D [0];
		public var audioClips : AudioClip [] = new AudioClip [0];

		public function GetFolder ( n : String ) : Folder {
			for ( var i : int = 0; i < subfolders.Length; i++ ) {
				if ( subfolders[i].name == n ) {
					return subfolders[i];
				}
			}
			
			return null;
		}

		public function AddTexture ( texture : Texture2D ) {
			var tmp : List.< Texture2D > = new List.< Texture2D > ( textures );

			tmp.Add ( texture );

			textures = tmp.ToArray ();
		}
		
		public function AddAudio ( audio : AudioClip ) {
			var tmp : List.< AudioClip > = new List.< AudioClip > ( audioClips );

			tmp.Add ( audio );

			audioClips = tmp.ToArray ();
		}
	}

	public var name : String;
	public var root : Folder;

	public function GetParent ( child : Folder ) : Folder {
		return GetFolder ( child.path.Replace ( "/" + child.name, "" ) );
	}

	public function GetFolder ( path : String ) : Folder {
		var strings : String[] = path.Split ( "/"[0] );
		var currentFolder : Folder = root;

		for ( var dirName : String in strings ) {
			var nextFolder : Folder = currentFolder.GetFolder ( dirName );
			
			if ( nextFolder ) {
				currentFolder = nextFolder;
			}
		}

		return currentFolder;
	}

	public function GetFolders ( path : String ) : Folder [] {
		var folder : Folder = GetFolder ( path );

		if ( folder ) {
			return folder.subfolders;
		
		} else {
			return null;

		}
	}
	
	public function GetObject ( path : String, type : System.Type ) : Object {
		if ( type == typeof ( Texture2D ) ) {
			return GetTexture ( path );
		
		} else if ( type == typeof ( AudioClip ) ) {
			return GetAudioClip ( path );
		
		} else {
			return null;

		}
	}	

	public function GetObjects ( path : String, type : System.Type ) : Object [] {
		if ( type == typeof ( Texture2D ) ) {
			return GetTextures ( path );
		
		} else if ( type == typeof ( AudioClip ) ) {
			return GetAudioClips ( path );
		
		} else {
			return null;

		}
	}	

	public function GetTextures ( path : String ) : Texture2D [] {
		var folder : Folder = GetFolder ( path );
		
		if ( folder ) {
			return folder.textures;
		
		} else {
			return null;
		
		}
	}

	public function GetTexture ( path : String ) : Texture2D {
		var folder : Folder = GetFolder ( path );
		
		if ( folder ) {
			for ( var i : int = 0; i < folder.textures.Length; i++ ) {
				if ( folder.textures[i].name == name ) {
					return folder.textures[i];
				}
			}

			return null;
	
		} else {
			return null;
		
		}
	}

	public function GetAudioClips ( path : String ) : AudioClip [] {
		var folder : Folder = GetFolder ( path );
		
		if ( folder ) {
			return folder.audioClips;
		
		} else {
			return null;
		
		}
	}
	public function GetAudioClip ( path : String ) : AudioClip {
		var folder : Folder = GetFolder ( path );
		var audioName : String = OFBundleManager.GetName ( path );

		if ( folder ) {
			for ( var i : int = 0; i < folder.audioClips.Length; i++ ) {
				if ( folder.audioClips[i].name == audioName ) {
					return folder.audioClips[i];
				}
			}

			return null;
		
		} else {
			return null;
		
		}
	}
}
