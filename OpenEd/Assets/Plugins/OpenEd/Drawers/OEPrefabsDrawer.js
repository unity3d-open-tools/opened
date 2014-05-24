#pragma strict

public class OEPrefabsDrawer extends OEDrawer {
	public var rootFolder : OEFolder;
	
	public var scrollview : Transform;
	public var foldername : OGLabel;
	public var placeButton : OGButton;
	public var parentButton : OGButton;
	public var objectName : OGLabel;

	private var currentFolder : OEFolder;
	private var path : String;
	private var selectedObject : String = "";
	private var typeFilter : System.Type;

	public function Clear () {
		for ( var i : int = 0; i < scrollview.childCount; i++ ) {
			Destroy ( scrollview.GetChild ( i ).gameObject );
		}

		selectedObject = "";
		objectName.text = "";
		placeButton.gameObject.SetActive ( false );
	}

	public function SelectObject ( n : String ) {
		objectName.text = n;
		selectedObject = n;
		placeButton.gameObject.SetActive ( true );
	}

	public function SetPicker ( callback : Function, type : System.Type ) {
		typeFilter = type;
		Populate ();

		placeButton.func = function () {
			callback ( Resources.Load ( path + "/" + selectedObject ) );	
		};
	}

	public function Populate () {
		Clear ();

		foldername.text = path;

		var offset : Vector2;
		var width : float = Screen.width - 12;
		var size : float = 100;
		var spacing : float = 10;
		
		if ( currentFolder.subfolders.Length == 0 ) {
			var objects : Object [] = OEFileSystem.GetResources ( path, typeof ( OFSerializedObject ) ); 

			for ( var i : int = 0; i < objects.Length; i++ ) {
				var obj : OFSerializedObject = objects[i] as OFSerializedObject;

				if ( obj ) {
					var b : OGListItem = new GameObject ( obj.gameObject.name ).AddComponent.< OGListItem >();
					var t : OGTexture = new GameObject ( obj.gameObject.name + "_tex" ).AddComponent.< OGTexture >();

					b.transform.parent = scrollview;
					b.transform.localScale = new Vector3 ( size, size, -1 );
					b.transform.localPosition = new Vector3 ( offset.x, offset.y, 1 );

					b.target = this.gameObject;
					b.message = "SelectObject";
					b.argument = obj.gameObject.name;

					t.transform.parent = scrollview;
					t.transform.localScale = new Vector3 ( size, size, -2 );
					t.transform.localPosition = new Vector3 ( offset.x, offset.y, 0 );

					offset.x += size + spacing;

					if ( offset.x >= width - size + spacing ) {
						offset.x = 0;
						offset.y += size + spacing;
					}

					OEWorkspace.GetInstance().previewCamera.CreatePreview ( obj.gameObject, t );

					b.ApplyDefaultStyles ();
				}
			}
		
		} else {
			for ( i = 0; i < currentFolder.subfolders.Length; i++ ) {
				var l : OGListItem = new GameObject ( currentFolder.subfolders[i].name ).AddComponent.< OGListItem > ();

				l.transform.parent = scrollview;
				l.transform.localScale = new Vector3 ( Screen.width - 90, 30, 1 );
				l.transform.localPosition = new Vector3 ( offset.x, offset.y, -1 );
				
				l.text = currentFolder.subfolders[i].name;
				l.target = this.gameObject;
				l.message = "GoToChildFolder";
				l.argument = l.text;
				
				offset.y += 30;

				l.ApplyDefaultStyles ();
			}

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
		
		currentFolder = currentFolder.GetSubfolder ( folder );

		Populate ();
	}

	public function Add () {
		if ( !String.IsNullOrEmpty ( selectedObject ) ) {
			OEWorkspace.GetInstance().AddPrefab ( path + "/" + selectedObject );
	
			OEWorkspace.GetInstance().toolbar.Clear ();
		}
	}

	public function Start () {
		currentFolder = rootFolder;
		path = currentFolder.name;
		Populate ();
		objectName.text = "";
		placeButton.func = null;
	}
}
