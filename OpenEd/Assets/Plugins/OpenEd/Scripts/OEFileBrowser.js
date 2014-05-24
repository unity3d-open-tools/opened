#pragma strict

public class OEFileBrowser extends OGPage {
	public enum BrowseMode {
		Open,
		Save
	}

	public var browseMode : BrowseMode;
	public var callback : Function;
	public var sender : String;
	public var filter : String;

	public var scrollview : Transform;
	public var openObjects : GameObject;
	public var saveObjects : GameObject;
	public var filenameInput : OGTextField;
	public var filepathInput : OGTextField;
	public var parentDirButton : OGButton;
	
	private var openPath : String;
	private var savePath : String;
	private var selectedFile : FileInfo;
	private var folders : DirectoryInfo[];
	private var files : FileInfo[];

	public function Clear () {
		scrollview.GetComponent.< OGScrollView > ().position = Vector2.zero;
		
		for ( var i : int = 0; i < scrollview.childCount; i++ ) {
			Destroy ( scrollview.GetChild ( i ).gameObject );
		}
	}

	public function GoToPath () {
		SetPath ( filepathInput.text );

		Populate ();
	}

	public function GoToParentFolder () {
		var parentFolder : DirectoryInfo;
		
		if ( browseMode == BrowseMode.Open ) {
			parentFolder = OEFileSystem.GetParentFolder ( openPath );

			if ( parentFolder ) {
				openPath = parentFolder.FullName;
			}

		} else {
			parentFolder = OEFileSystem.GetParentFolder ( savePath );

			if ( parentFolder ) {
				savePath = parentFolder.FullName;
			}

		}
	
		Populate ();
	}

	public function GoToChildFolder ( folder : String ) {
		AppendPath ( "/" + folder );

		Populate ();
	}

	public function SelectFile ( file : String ) {
		if ( browseMode == BrowseMode.Save ) {
			filenameInput.text = file;
		}

		for ( var i : int = 0; i < files.Length; i++ ) {
			if ( files[i].Name == file ) {
				selectedFile = files[i];
				return;
			}
		}
	}

	private function AddListItem ( text : String, message : String, offset : float, color : Color ) {
		var li : OGListItem = new GameObject ( text ).AddComponent.< OGListItem > ();

		li.text = text;
		li.target = this.gameObject;
		li.message = message;
		li.argument = text;
		li.ApplyDefaultStyles ();
		li.tint = color;

		li.transform.parent = scrollview;
		li.transform.localScale = new Vector3 ( 570, 20, 1 );
		li.transform.localPosition = new Vector3 ( 0, offset, -1 );
	}

	private function GetPath () : String {
		if ( browseMode == BrowseMode.Open ) {
			return openPath;

		} else {
			return savePath;

		}
	}

	private function SetPath ( path : String ) {
		if ( browseMode == BrowseMode.Open ) {
			openPath = path;

		} else {
			savePath = path;

		}
	}

	private function AppendPath ( append : String ) {
		SetPath ( GetPath() + append );
	}

	public function Populate () {
		Clear ();
		
		var offset : float;
		folders = OEFileSystem.GetFolders ( GetPath() );
		files = OEFileSystem.GetFiles ( GetPath() );
		
		for ( var i : int = 0; i < folders.Length; i++ ) {
			AddListItem ( folders[i].Name, "GoToChildFolder", offset, new Color ( 0.9, 0.9, 0.9, 1 ) );
			offset += 20;
		}
		
		for ( i = 0; i < files.Length; i++ ) {
			if ( !files[i].Name.Contains ( ".meta" ) && ( String.IsNullOrEmpty ( filter ) || files[i].Name.Contains ( filter ) ) ) {
				AddListItem ( files[i].Name, "SelectFile", offset, Color.white );
				offset += 20;
			}
		}
		
		filepathInput.text = GetPath();
	}

	public function Save () {
		if ( callback && !String.IsNullOrEmpty ( filenameInput.text ) ) {
			callback ( savePath + "/" + filenameInput.text );
			OGRoot.GetInstance().GoToPage ( sender );
		}
	}

	public function Open () {
		if ( callback && selectedFile && !String.IsNullOrEmpty ( sender ) ) {
			callback ( selectedFile, openPath );
			OGRoot.GetInstance().GoToPage ( sender );
		
		} else {
		
			Debug.LogError ( "OEFileBrowser | Missing callback or sender" );
		}
	}

	public function Cancel () {
		OGRoot.GetInstance().GoToPage ( sender );
	}

	override function ExitPage () {
		selectedFile = null;
		callback = null;
		sender  = "";
		filter = "";
		files = null;
		folders = null;
	}

	override function StartPage () {
		if ( String.IsNullOrEmpty ( openPath ) ) {
			openPath = Application.dataPath;
		}
		
		if ( String.IsNullOrEmpty ( savePath ) ) {
			savePath = Application.dataPath;
		}

		openObjects.SetActive ( browseMode == BrowseMode.Open );
		saveObjects.SetActive ( browseMode == BrowseMode.Save );

		scrollview.GetComponent.< OGScrollView > ().size.y = browseMode == BrowseMode.Open ? 275 : 235;

		Populate ();
	}
}
