#pragma strict

class OESkydome extends MonoBehaviour {
	public var cam : Camera;
	public var modifier : float = 0.025;
	public var target : Transform;

	public function Update () {
		this.transform.position = new Vector3 ( 0, 2000, 0 );
	
		if ( !cam ) {
			cam = new GameObject ( "SkyboxCamera" ).AddComponent.< Camera > ();
			cam.transform.parent = this.transform;
		
		} else {
			cam.transform.rotation = Camera.main.transform.rotation;

			if ( target ) {
				cam.transform.localPosition = target.position * modifier;
			
			} else {
				cam.transform.localPosition = Vector3.zero;

			}
			
			cam.depth = Camera.main.depth - 1;

		}

	}
}
