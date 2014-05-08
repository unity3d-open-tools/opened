#pragma strict

public class OEInspector extends MonoBehaviour {
	public var objectName : OGTextField;
	public var transformInspector : OETransformInspector;
	public var componentContainer : Transform;
	public var componentTypes : OEComponentInspector[];
	public var componentSwitch : OGPopUp;
	
	@HideInInspector public var selection : OFSerializedObject[];

	public function Clear () {
		for ( var i : int = 0; i < componentContainer.childCount; i++ ) {
			Destroy ( componentContainer.GetChild ( i ).gameObject );
		}
	}

	public function IsComponentSupported ( name : String ) : boolean {
		for ( var i : int = 0; i < componentTypes.Length; i++ ) {
			if ( componentTypes[i].typeId == name ) {
				return true;
			}	
		}

		return false;
	}

	public function SelectComponent ( name : String ) {
		for ( var i : int = 0; i < componentTypes.Length; i++ ) {
			if ( componentTypes[i].typeId == name ) {
				Clear ();

				var newComponent : OEComponentInspector = Instantiate ( componentTypes[i] ) as OEComponentInspector;
				newComponent.transform.parent = componentContainer;
				newComponent.transform.localPosition = Vector3.zero;
				newComponent.transform.localScale = Vector3.one;

				newComponent.Init ( selection[0] );
			}	
		}
	}

	public function Start () {
	}

	public function Update () {
		if ( selection.Length == 1 ) {
			objectName.text = objectName.text.Replace ( "\n", "" );
			selection[0].gameObject.name = objectName.text;
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
			transformInspector.Init ( selection[0] );
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
