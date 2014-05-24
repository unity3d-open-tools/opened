#pragma strict

public class OCTreeEditor extends OGPage {

	public var currentTree : OFSerializedObject;
	public var componentContainer : Transform;

	private var inspector : OCTreeInspector;
	private var savePath : String;

	public function New () {
		inspector.Clear ();
		Destroy ( currentTree.gameObject.GetComponent.< OCTree > () );
		currentTree.gameObject.AddComponent.< OCTree > ();
		inspector.Init ( currentTree, componentContainer );
	}

	public function Open () {
		var fileBrowser : OEFileBrowser = OEWorkspace.GetInstance().fileBrowser;
		fileBrowser.browseMode = OEFileBrowser.BrowseMode.Open;
		fileBrowser.filter = ".tree";
		fileBrowser.callback = function ( file : FileInfo ) {
			savePath = file.FullName;
			
			OFDeserializer.Deserialize ( OFReader.LoadFile ( file.FullName ), currentTree );
			inspector.Clear ();
			inspector.Init ( currentTree, componentContainer );
		};
		fileBrowser.sender = "TreeEditor";
		OGRoot.GetInstance().GoToPage ( "FileBrowser" );
	}

	public function Save () {
		if ( !String.IsNullOrEmpty ( savePath ) ) {
			OFWriter.SaveFile ( OFSerializer.Serialize ( currentTree ), savePath );

		} else {
			SaveAs ();

		}
	}

	public function SaveAs () {
		var fileBrowser : OEFileBrowser = OEWorkspace.GetInstance().fileBrowser;
		fileBrowser.browseMode = OEFileBrowser.BrowseMode.Save;
		fileBrowser.callback = function ( path : String ) { savePath = path; Save(); };
		fileBrowser.sender = "TreeEditor";
		OGRoot.GetInstance().GoToPage ( "FileBrowser" );
	}

	override function ExitPage () {
		savePath = "";
	}

	override function StartPage () {
		if ( !inspector ) {
			inspector = System.Activator.CreateInstance ( typeof ( OCTreeInspector ) ) as OCTreeInspector;
			inspector.width = Screen.width - 40;
		}
	}

	function Update () {
		inspector.Update ();
	}
}
