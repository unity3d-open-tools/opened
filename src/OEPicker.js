#pragma strict

public class OEPicker extends OGPage {
	public var message : OGLabel;
	public var callback : Function;
	public var type : System.Type;

	override function StartPage () {
		message.text = "Pick an object (" + type.ToString().Replace("UnityEngine.","") + ")";
	}

	public function Update () {
		if ( Input.GetMouseButtonDown ( 0 ) ) {
			var hit : RaycastHit;
			var ray : Ray = Camera.main.ScreenPointToRay ( Input.mousePosition );
			
			if ( Physics.Raycast ( ray, hit, Mathf.Infinity ) ) {
				var obj : Object = hit.collider.gameObject;

				if ( type == typeof ( GameObject ) || ( obj as GameObject ).GetComponent ( type ) ) {
					callback ( obj );
					OGRoot.GetInstance().GoToPage ( "Home" );
				
				}
			
			}	

		} else if ( Input.GetKeyDown ( KeyCode.Escape ) ) {
			OGRoot.GetInstance().GoToPage ( "Home" );

		}
	}
}
