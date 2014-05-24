#pragma strict

public class ODDestructibleObject extends MonoBehaviour {
	public var pieces : GameObject[];
	public var event : OCEvent;

	public var destroyed : boolean = false;

	private function SpawnPieces () : List.< Collider > {
		var list : List.< Collider > = new List.< Collider > ();
		
		for ( var o : GameObject in pieces ) {
			var newObj : GameObject = Instantiate ( o );
			var col : BoxCollider = newObj.GetComponent ( BoxCollider );
			var randScale : float = Random.Range ( 0.25, 1 );
			var bounds : Bounds = this.collider.bounds;

			newObj.transform.parent = this.transform;
			newObj.transform.position = new Vector3 (
					Random.Range ( bounds.min.x, bounds.max.x ),
					Random.Range ( bounds.min.y, bounds.max.y ),
					Random.Range ( bounds.min.z, bounds.max.z ) );
			newObj.transform.localScale = new Vector3 ( randScale, randScale, randScale );

			list.Add ( col );
		}

		return list;
	}

	public function Explode ( position : Vector3, force : float, radius : float ) {
		if ( destroyed ) { return; }
		
		var colliders : List.< Collider > = SpawnPieces ();

		for ( var col : Collider in colliders ) {
			col.rigidbody.AddExplosionForce ( force, position, radius, 1 );
		}

		destroyed = true;

		Destroy ( this.gameObject );
	}
	
	public function Explode ( force : float, radius : float ) {
		Explode ( this.transform.position, force, radius );
	}
}
