#pragma strict

public class OEProperties extends OGPage {
	public var data : JSONObject = new JSONObject ( JSONObject.Type.OBJECT );
	public var content : Transform;

	private var inspector : OEPropertiesInspector;

	override function StartPage () {
		if ( !inspector ) {
			inspector = System.Activator.CreateInstance ( typeof ( OEPropertiesInspector ) ) as OEPropertiesInspector;
		}

		inspector.Init ( this.GetComponent.< OFSerializedObject > (), content );
		inspector.width = 376;
	}

	function Update () {
		if ( inspector ) {
			inspector.Update ();
		}
	}
}
