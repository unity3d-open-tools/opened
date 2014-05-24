#pragma strict

public class OETransformInspector extends OEComponentInspector {
	override function get type () : System.Type { return typeof ( Transform ); }
	
	override function Inspector () {
		var t : Transform = target.transform;

		if ( Button ( "P", new Rect ( 0, 0, 20, 16 ) ) ) { ResetPosition (); }
		if ( Button ( "R", new Rect ( 0, 20, 20, 16 ) ) ) { ResetRotation (); }
		if ( Button ( "S", new Rect ( 0, 40, 20, 16 ) ) ) { ResetScale (); }

		Offset ( 25, 0 );

		t.localPosition = Vector3Field ( "", t.localPosition );
		t.localEulerAngles = Vector3Field ( "", t.localEulerAngles );
		t.localScale = Vector3Field ( "", t.localScale );
	}

	public function ResetPosition () {
		if ( target ) {
			var t : Transform = target.transform;
			t.localPosition = Vector3.zero;
		}
	}
	
	public function ResetRotation () {
		if ( target ) {
			var t : Transform = target.transform;
			t.localEulerAngles = Vector3.zero;
		}
	}
	
	public function ResetScale () {
		if ( target ) {
			var t : Transform = target.transform;
			t.localScale = Vector3.one;
		}
	}
}
