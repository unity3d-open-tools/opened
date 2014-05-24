#pragma strict

// Bezier script by Loran (http://forum.unity3d.com/members/2144-Loran)

public class Bezier extends System.Object {
	public var p0 : Vector3;
	public var p1 : Vector3;
	public var p2 : Vector3;
	public var p3 : Vector3;

	public var ti : float = 0.0;

	private var b0 : Vector3 = Vector3.zero;
	private var b1 : Vector3 = Vector3.zero;
	private var b2 : Vector3 = Vector3.zero;
	private var b3 : Vector3 = Vector3.zero;

	private var Ax : float;
	private var Ay : float;
	private var Az : float;

	private var Bx : float;
	private var By : float;
	private var Bz : float;

	private var Cx : float;
	private var Cy : float;
	private var Cz : float;

	// Init function v0 = 1st point, v1 = handle of the 1st point , v2 = handle of the 2nd point, v3 = 2nd point
	// handle1 = v0 + v1
	// handle2 = v3 + v2
	public function Bezier(v0 : Vector3, v1 : Vector3, v2 : Vector3, v3 : Vector3) {
		p0 = v0;
		p1 = v1;
		p2 = v2;
		p3 = v3;
	}

	// 0.0 >= t <= 1.0
	public function GetPointAtTime ( t : float) : Vector3 {
		CheckConstant();
		var t2 : float = t * t;
		var t3 : float = t * t * t;
		var x : float = Ax * t3 + Bx * t2 + Cx * t + p0.x;
		var y : float = Ay * t3 + By * t2 + Cy * t + p0.y;
		var z : float = Az * t3 + Bz * t2 + Cz * t + p0.z;
		return(Vector3(x,y,z));
	}

	private function SetConstant() {
		Cx = 3 * ((p0.x + p1.x) - p0.x);
		Bx = 3 * ((p3.x + p2.x) - (p0.x + p1.x)) - Cx;
		Ax = p3.x - p0.x - Cx - Bx;

		Cy = 3 * ((p0.y + p1.y) - p0.y);
		By = 3 * ((p3.y + p2.y) - (p0.y + p1.y)) - Cy;
		Ay = p3.y - p0.y - Cy - By;

		Cz = 3 * ((p0.z + p1.z) - p0.z);
		Bz = 3 * ((p3.z + p2.z) - (p0.z + p1.z)) - Cz;
		Az = p3.z - p0.z - Cz - Bz;
	}

	// Check if p0, p1, p2 or p3 have changed
	private function CheckConstant() {
		if (p0 != b0 || p1 != b1 || p2 != b2 || p3 != b3) {
			SetConstant();
			b0 = p0;
			b1 = p1;
			b2 = p2;
			b3 = p3;
		}
	}
}
