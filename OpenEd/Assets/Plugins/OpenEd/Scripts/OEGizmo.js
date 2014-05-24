#pragma strict

public class OEGizmo extends MonoBehaviour {
	public var mode : OETransformMode;
	public var x : OEGizmoAxis;
	public var y : OEGizmoAxis;
	public var z : OEGizmoAxis;

	public var following : boolean = true;

	private var prevPos : Vector3;

	private function Round ( v : Vector3 ) : Vector3 {
		v.x = Math.Round ( v.x / 0.25, MidpointRounding.AwayFromZero ) * 0.25;
		v.y = Math.Round ( v.y / 0.25, MidpointRounding.AwayFromZero ) * 0.25;
		v.z = Math.Round ( v.z / 0.25, MidpointRounding.AwayFromZero ) * 0.25;
		
		return v; 
	}

	private function ShouldRound () : boolean {
		return Input.GetKey ( KeyCode.LeftControl ) || Input.GetKey ( KeyCode.RightControl ) || Input.GetKey ( KeyCode.LeftCommand ) || Input.GetKey ( KeyCode.RightCommand );
	}

	private function GetAveragePosition () : Vector3 {
		var result : Vector3 = Vector3.zero;
		
		if ( OEWorkspace.GetInstance().selection.Count > 0 ) {
			for ( var i : int = 0; i < OEWorkspace.GetInstance().selection.Count; i++ ) {
				var pos : Vector3 = OEWorkspace.GetInstance().selection[i].transform.position;
				var renderer : Renderer = OEWorkspace.GetInstance().selection[i].gameObject.GetComponentInChildren.< Renderer > ();
				
				if ( renderer ) {
					pos = renderer.bounds.center;
				}

				result += pos;
			}

			result /= OEWorkspace.GetInstance().selection.Count;
		}

		return result;
	}
	
	public function PutInCenter () {
		this.transform.position = GetAveragePosition ();
	}

	public function Move ( delta : Vector3 ) {
		this.transform.position += delta;
		
		if ( ShouldRound() ) {
			this.transform.position = Round ( this.transform.position );
		}

		for ( var i : int = 0; i < OEWorkspace.GetInstance().selection.Count; i++ ) {
			var t : Transform = OEWorkspace.GetInstance().selection[i].transform;
			t.position += delta;
			
			if ( ShouldRound() ) {
				t.position = Round ( t.position );
			}
		}
	}
	
	public function Rotate ( axis : OEGizmoAxis.Axis ) {
		var dx : float = -Input.GetAxis ( "Mouse X" ) * 2;
		var dy : float = Input.GetAxis ( "Mouse Y" ) * 2;
		var delta : Vector3;

		switch ( axis ) {
			case OEGizmoAxis.Axis.X:
				delta.x = dy;
				break;
			
			case OEGizmoAxis.Axis.Y:
				delta.y = dx;
				break;
			
			case OEGizmoAxis.Axis.Z:
				delta.z = dx;
				break;
		}
		
		for ( var i : int = 0; i < OEWorkspace.GetInstance().selection.Count; i++ ) {
			var t : Transform = OEWorkspace.GetInstance().selection[i].transform;
			t.localRotation = Quaternion.Euler ( t.localEulerAngles + delta );

			if ( ShouldRound() ) {
				t.localEulerAngles = Round ( t.localEulerAngles );
			}
		}
	}
	
	public function Scale ( delta : Vector3 ) {
		delta.z = -delta.z;

		for ( var i : int = 0; i < OEWorkspace.GetInstance().selection.Count; i++ ) {
			var t : Transform = OEWorkspace.GetInstance().selection[i].transform;
			var result = t.localScale + delta;
			
			if ( result.x > 0.1 && result.y > 0.1 && result.z > 0.1 ) {
				t.localScale += delta;
				
				if ( ShouldRound() ) {
					t.localScale = Round ( t.localScale );
				}
			}
		}
	}

	public function Update () {
		this.transform.localScale = new Vector3 ( 0.075, 0.075, 0.075 ) * Vector3.Distance ( Camera.main.transform.position, this.transform.position );
	
		if ( following ) {
			this.transform.position = GetAveragePosition ();
		}
	}
}
