#pragma strict

public class OEAssetBrowser extends OGPage {
	public var callback : Function;
	public var sender : String;
	public var filter : System.Type;
	public var rootFolder : OEFolder;
	public var scrollview : Transform;
	public var parentDirButton : OGButton;
	public var pathLabel : OGLabel;
	public var path : String;
	
	private var currentFolder : OEFolder;
	private var selectedAsset : String;

	public function Clear () {
		scrollview.GetComponent.< OGScrollView > ().position = Vector2.zero;
		
		for ( var i : int = 0; i < scrollview.childCount; i++ ) {
			Destroy ( scrollview.GetChild ( i ).gameObject );
		}
	}

	public function GoToParentFolder () {
		if ( currentFolder != rootFolder ) {
			var strings : String[] = path.Split ( "/"[0] );

			path = "";

			for ( var i : int = 0; i < strings.Length - 1; i++ ) {
				if ( i > 0 ) {
					path += "/";
				}
				
				path += strings[i];
			}

			currentFolder = rootFolder.GetFolderFromPath ( path );
			
			Populate ();
		}
	}

	public function GoToChildFolder ( folder : String ) {
		if ( !String.IsNullOrEmpty ( path ) ) {
			path += "/";
		}	
		
		path += folder;
		
		currentFolder = rootFolder.GetFolderFromPath ( path );

		Populate ();
	}

	public function SelectAsset ( file : String ) {
		selectedAsset = file;
	}

	private function AddListItem ( text : String, message : String, offset : float ) {
		var li : OGListItem = new GameObject ( text ).AddComponent.< OGListItem > ();

		li.text = text;
		
		if ( String.IsNullOrEmpty ( message ) ) {
			li.isDisabled = true;
			li.tint.a = 0.5;

		} else {
			li.target = this.gameObject;
			li.message = message;
			li.argument = text;
		
		}

		li.ApplyDefaultStyles ();

		li.transform.parent = scrollview;
		li.transform.localScale = new Vector3 ( 570, 20, 1 );
		li.transform.localPosition = new Vector3 ( 0, offset, -1 );
	}

	public function Populate () {
		Clear ();
	
		pathLabel.text = path;

		var offset : float;
	
		if ( currentFolder.subfolders.Length > 0 ) {
			for ( var i : int = 0; i < currentFolder.subfolders.Length; i++ ) {
				AddListItem ( currentFolder.subfolders[i].name, "GoToChildFolder", offset );
				offset += 20;
			}
		
		} else {
			var objects : Object [] = Resources.LoadAll ( path );
			
			for ( i = 0; i < objects.Length; i++ ) {
				if ( filter == null || objects[i].GetType() == filter ) {
					AddListItem ( ( objects[i] as UnityEngine.Object ).name, "SelectAsset", offset );
				
				}

				offset += 20;
			}

		
		}	
			
	}

	public function Load () {
		if ( callback && selectedAsset && !String.IsNullOrEmpty ( sender ) ) {
			callback ( Resources.Load ( path + "/" + selectedAsset ) );
			OGRoot.GetInstance().GoToPage ( sender );
		
		} else {
		
			Debug.LogError ( "OEAssetBrowser | Missing callback or sender" );
		}
	}

	public function Cancel () {
		OGRoot.GetInstance().GoToPage ( sender );
	}

	override function ExitPage () {
		selectedAsset = null;
		callback = null;
		sender  = "";
		filter = null;
	}

	override function StartPage () {
		currentFolder = rootFolder.GetFolderFromPath ( path );
		
		Populate ();
	}
}
