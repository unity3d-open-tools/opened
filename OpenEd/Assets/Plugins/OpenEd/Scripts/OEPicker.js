#pragma strict

public class OEPicker extends OGPage {
	public var message : OGLabel;
	public var callback : Function;
	public var type : System.Type;
	public var getPoint : boolean = false;
	@NonSerialized public var sender : String = "Home";

	override function StartPage () {
		if ( getPoint ) {
			message.text = "Pick a point";
		
		} else {
			message.text = "Pick an object (" + type.ToString().Replace("UnityEngine.","") + ")";
		
		}
	}

	override function ExitPage () {
		type = null;
		callback = null;
		getPoint = false;
		sender = "Home";
	}

	public function Update () {
		if ( Input.GetMouseButtonDown ( 0 ) ) {
			var hit : RaycastHit;
			var ray : Ray = Camera.main.ScreenPointToRay ( Input.mousePosition );
			
			if ( Physics.Raycast ( ray, hit, Mathf.Infinity ) ) {
				var obj : Object = hit.collider.gameObject;

				if ( getPoint ) {
					callback ( hit.point );
					OGRoot.GetInstance().GoToPage ( sender );

				} else {
					if ( type == typeof ( GameObject ) || ( obj as GameObject ).GetComponent ( type ) ) {
						callback ( obj );
						OGRoot.GetInstance().GoToPage ( sender );
					
					}
				}
			}	

		} else if ( Input.GetKeyDown ( KeyCode.Escape ) ) {
			OGRoot.GetInstance().GoToPage ( sender );

		}
	}
}
