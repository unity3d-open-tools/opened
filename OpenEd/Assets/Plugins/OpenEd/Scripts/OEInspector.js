#pragma strict

public class OEInspector extends MonoBehaviour {
	public var objectName : OGTextField;
	public var transformContainer : Transform;
	public var componentContainer : Transform;
	public var componentSwitch : OGPopUp;
	
	@HideInInspector public var selection : OFSerializedObject[];

	private var inspectors : OEComponentInspector [];
	private var currentInspector : OEComponentInspector;
	private var transformInspector : OETransformInspector;

	public function Clear () {
		if ( currentInspector ) {
			currentInspector.Clear ();
			currentInspector = null;
		}

		for ( var i : int = 0; i < componentContainer.childCount; i++ ) {
			Destroy ( componentContainer.GetChild ( i ).gameObject );
		}
	}

	public function IsComponentSupported ( name : String ) : boolean {
		for ( var i : int = 0; i < inspectors.Length; i++ ) {
			if ( inspectors[i].CheckType ( name ) ) {
				return true;
			}	
		}

		return false;
	}

	public function SelectComponent ( name : String ) {
		OEWorkspace.GetInstance().cam.currentInspector = null;
		
		for ( var i : int = 0; i < inspectors.Length; i++ ) {
			if ( inspectors[i].CheckType ( name ) ) {
				Clear ();
				currentInspector = inspectors[i];
				currentInspector.Init ( selection[0], componentContainer );
				OEWorkspace.GetInstance().cam.currentInspector = currentInspector;
			}
		}
	}

	public function Start () {
		inspectors = OEReflector.GetInspectors ();

		for ( var i : int = 0; i < inspectors.Length; i++ ) {
			if ( inspectors[i].type == typeof ( Transform ) ) {
				transformInspector = inspectors[i] as OETransformInspector;
			}
		}
	}

	public function Update () {
		if ( selection.Length == 1 ) {
			objectName.text = objectName.text.Replace ( "\n", "" );
			selection[0].gameObject.name = objectName.text;
		
			if ( currentInspector ) {
				currentInspector.Update ();
			}

			if ( transformInspector ) {
				transformInspector.Update ();
			}
		
		} else if ( currentInspector ) {
			Clear ();

		}
	}

	public function SetActive ( isActive : boolean ) {
		for ( var i : int = 0; i < this.transform.childCount; i++ ) {
			this.transform.GetChild ( i ).gameObject.SetActive ( isActive );
		}
	}

	public function Refresh ( list : List.< OFSerializedObject > ) {
		Clear ();

		selection = list.ToArray ();

		if ( selection.Length == 1 ) {
			transformInspector.Init ( selection[0], transformContainer );
			objectName.text = selection[0].gameObject.name;

			var tmpStrings : List.< String > = new List.< String > ();

			var obj : OFSerializedObject = selection[0];
			
			for ( var f : int = 0; f < obj.fields.Length; f++ ) {
				if ( obj.fields[f].component && obj.fields[f].name != "Transform" && IsComponentSupported ( obj.fields[f].name ) ) {
					tmpStrings.Add ( obj.fields[f].name );
				}
			}

			componentSwitch.options = tmpStrings.ToArray ();

			if ( componentSwitch.options.Length > 0 ) {
				componentSwitch.gameObject.SetActive ( true );
				componentSwitch.selectedOption = componentSwitch.options[0];
				SelectComponent ( componentSwitch.selectedOption );
			
			} else {
				componentSwitch.gameObject.SetActive ( false );
			
			}
		
		} else {
			componentSwitch.selectedOption = "";

		}
	}
}
