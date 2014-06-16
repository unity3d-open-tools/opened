#pragma strict

public class OEResourceBrowser extends OGPage {
	public var callback : Function;
	public var sender : String;
	public var filter : System.Type;
	public var rootFolder : OEFolder;
	public var rootPicker : OGPopUp;
	public var scrollview : Transform;
	public var parentDirButton : OGButton;
	public var pathLabel : OGLabel;
	public var path : String;
	public var getPath : boolean = false;
	
	private var currentBundle : OFBundle;
	private var currentBundleFolder : OFBundle.Folder;
	private var currentFolder : OEFolder;
	private var selectedResource : String;

	public function Clear () {
		scrollview.GetComponent.< OGScrollView > ().position = Vector2.zero;
		
		for ( var i : int = 0; i < scrollview.childCount; i++ ) {
			Destroy ( scrollview.GetChild ( i ).gameObject );
		}
	}

	public function SelectRoot ( name : String ) {
		if ( name != "Resources" ) {
			currentBundle = OFBundleManager.instance.GetBundle ( name );
			currentBundleFolder = currentBundle.root;
			path = "";

			Populate ();

		} else {
			currentBundle = null;
			currentBundleFolder = null;
			currentFolder = rootFolder;
			path = "";

			Populate ();

		}
	}

	public function GoToParentFolder () {
		if ( currentBundle ) {
			if ( currentBundleFolder != currentBundle.root ) {
				currentBundleFolder = currentBundle.GetParent ( currentBundleFolder );
				
				path = currentBundleFolder.path.Replace ( Application.dataPath + "/" + OFBundleManager.instance.bundleFolder + "/" + currentBundle.name + "/", "" );

				Populate ();

			}

		} else if ( currentFolder != rootFolder ) {
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
		if ( currentBundle ) {
			currentBundleFolder = currentBundleFolder.GetFolder ( folder );

			path = currentBundleFolder.path.Replace ( Application.dataPath + "/" + OFBundleManager.instance.bundleFolder + "/" + currentBundle.name + "/", "" );

			Populate ();

		} else {
			if ( !String.IsNullOrEmpty ( path ) ) {
				path += "/";
			}	
			
			path += folder;
			
			currentFolder = rootFolder.GetFolderFromPath ( path );
		}

		Populate ();
	}

	public function SelectResource ( file : String ) {
		selectedResource = file;
	}
	
	private function AddListItem ( text : String, message : String, offset : Vector2 ) {
		var li : OGListItem = new GameObject ( "li_" + text ).AddComponent.< OGListItem > ();
		var lbl : OGLabel = new GameObject ( "lbl_" + text ).AddComponent.< OGLabel >();

		lbl.text = text;
		
		if ( String.IsNullOrEmpty ( message ) ) {
			li.isDisabled = true;
			li.tint.a = 0.5;

		} else {
			li.target = this.gameObject;
			li.message = message;
			li.argument = text;
		
		}

		li.ApplyDefaultStyles ();
		lbl.ApplyDefaultStyles ();
		lbl.overrideAlignment = true;
		lbl.alignment = TextAnchor.UpperCenter;

		li.transform.parent = scrollview;
		li.transform.localScale = new Vector3 ( 140, 140, 1 );
		li.transform.localPosition = new Vector3 ( offset.x, offset.y, -1 );
	
		lbl.transform.parent = scrollview;
		lbl.transform.localScale = new Vector3 ( 140, 20, 1 );
		lbl.transform.localPosition = new Vector3 ( offset.x, offset.y + 130, -2 );
	}

	private function AddListItem ( object : UnityEngine.Object, message : String, offset : Vector2 ) {
		var li : OGListItem = new GameObject ( "li_" + object.name ).AddComponent.< OGListItem > ();
		var lbl : OGLabel = new GameObject ( "lbl_" + object.name ).AddComponent.< OGLabel >();

		lbl.text = object.name;
		
		if ( String.IsNullOrEmpty ( message ) ) {
			li.isDisabled = true;
			li.tint.a = 0.5;

		} else {
			li.target = this.gameObject;
			li.message = message;
			li.argument = object.name;
		
		}

		li.ApplyDefaultStyles ();
		lbl.ApplyDefaultStyles ();
		lbl.overrideAlignment = true;
		lbl.alignment = TextAnchor.UpperCenter;

		li.transform.parent = scrollview;
		li.transform.localScale = new Vector3 ( 140, 140, 1 );
		li.transform.localPosition = new Vector3 ( offset.x, offset.y, -1 );
		
		lbl.transform.parent = scrollview;
		lbl.transform.localScale = new Vector3 ( 140, 20, 1 );
		lbl.transform.localPosition = new Vector3 ( offset.x, offset.y + 130, -2 );
		
		if ( object.GetType() == typeof ( Texture2D ) ) {
			var imgThumb : OGTexture = new GameObject ( "img_Thumb" ).AddComponent.< OGTexture > ();
			imgThumb.mainTexture = object as Texture2D;
			imgThumb.transform.parent = li.transform;
			imgThumb.transform.localPosition = new Vector3 ( 0, 0, -1 );
			imgThumb.transform.localScale = new Vector3 ( 0.9, 0.9, 1 );
		}
	}

	public function Populate () {
		Clear ();
	
		pathLabel.text = path;

		var offset : Vector2;
	
		if ( currentBundle ) {
			if ( currentBundleFolder.subfolders.Length > 0 ) {
				for ( var i : int = 0; i < currentBundleFolder.subfolders.Length; i++ ) {
					AddListItem ( currentBundleFolder.subfolders[i].name, "GoToChildFolder", offset );
					
					if ( offset.x + 150 > scrollview.GetComponent.< OGScrollView > ().size.x ) {
						offset.x = 0;
						offset.y += 150;
					
					} else {
						offset.x += 150;
					
					}
				}
			} else {
				var objects : Object [] = currentBundle.GetObjects ( path, filter );
				
				for ( i = 0; i < objects.Length; i++ ) {
					if ( filter == null || objects[i].GetType() == filter ) {
						AddListItem ( objects[i] as UnityEngine.Object, "SelectResource", offset );
					}

					if ( offset.x + 150 >= scrollview.GetComponent.< OGScrollView > ().size.x - 2 * scrollview.GetComponent.< OGScrollView > ().padding.x ) {
						offset.x = 0;
						offset.y += 150;
					
					} else {
						offset.x += 150;
					
					}
				}
			}

		} else {
			if ( currentFolder.subfolders.Length > 0 ) {
				for ( i = 0; i < currentFolder.subfolders.Length; i++ ) {
					AddListItem ( currentFolder.subfolders[i].name, "GoToChildFolder", offset );
					
					if ( offset.x + 150 > scrollview.GetComponent.< OGScrollView > ().size.x ) {
						offset.x = 0;
						offset.y += 150;
					
					} else {
						offset.x += 150;
					
					}
				}
			
			} else {
				objects = Resources.LoadAll ( path );
				
				for ( i = 0; i < objects.Length; i++ ) {
					if ( filter == null || objects[i].GetType() == filter ) {
						AddListItem ( objects[i] as UnityEngine.Object, "SelectResource", offset );
					}

					if ( offset.x + 150 > scrollview.GetComponent.< OGScrollView > ().size.x ) {
						offset.x = 0;
						offset.y += 150;
					
					} else {
						offset.x += 150;
					
					}
				}
			}
		}	
	}

	public function Load () {
		if ( callback && selectedResource && !String.IsNullOrEmpty ( sender ) ) {
			if ( getPath ) {
				var prefix : String = "";

				if ( currentBundle != null ) {
					prefix = currentBundle.name + ">";
				}

				callback ( prefix + path + "/" + selectedResource );
			
			} else if ( currentBundle != null ) {
				callback ( currentBundle.GetObject ( path + "/" + selectedResource, filter ) );

			} else {
				callback ( Resources.Load ( path + "/" + selectedResource ) );
			}
				
			OGRoot.GetInstance().GoToPage ( sender );
		
		} else {
		
			Debug.LogError ( "OEResourceBrowser | Missing callback or sender" );
		}
	}

	public function Cancel () {
		OGRoot.GetInstance().GoToPage ( sender );
	}

	override function ExitPage () {
		selectedResource = null;
		callback = null;
		sender  = "";
		filter = null;
		getPath = false;
		currentBundle = null;
	}

	override function StartPage () {
		currentFolder = rootFolder.GetFolderFromPath ( path );
		
		var tmpRoots : List.< String > = new List.< String > ();
	       
		for ( var dirPath : String in OFBundleManager.instance.GetBundleStrings () ) {
			var strings : String[] = dirPath.Replace ( "\\", "/" ).Split ( "/"[0] );
			if ( strings.Length > 0 ) {
				tmpRoots.Add ( strings [ strings.Length - 1 ] );
			
			} else {
				tmpRoots.Add ( dirPath );

			}
		}

		tmpRoots.Insert ( 0, "Resources" );

		rootPicker.selectedOption = "Resources";
		rootPicker.options = tmpRoots.ToArray ();		

		Populate ();
	}
}
