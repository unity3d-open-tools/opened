#pragma strict

public class OFPlanner extends MonoBehaviour {
	private var wait : int = 10;
	
	public var spawnedObjects : List.< OFSerializedObject > = new List.< OFSerializedObject > ();
	
	public function DeferConnection ( ie : IEnumerator ) {
		StartCoroutine ( ie );
		wait++;
	}

	public function Update () {
		if ( wait > 0 ) {
			wait--;
		
		} else {
			Destroy ( gameObject );
		
		}
	}
}
