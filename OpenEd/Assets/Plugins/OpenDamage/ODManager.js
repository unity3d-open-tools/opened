#pragma strict

class ODManager extends MonoBehaviour {
	static var instance : ODManager;
	
	public var expirationTime : float = 20.0;
	public var prefabBullet : GameObject;
	public var prefabExplosion : GameObject;
	
	private var shakeAmount : float;
	private var shakeFadeOut : float;

	// Start
	function Start () {
		instance = this;
	}
	
	// Get instance
	static function GetInstance () : ODManager {
		return instance;
	}
	
	// Destroy
	private function DestroyDelayed ( obj : GameObject, seconds : float ) : IEnumerator {
		yield WaitForSeconds ( seconds );

		Destroy ( obj );
	}

	// Update
	public function LateUpdate () {
		// Shake
		if ( shakeAmount > 0 ) {
			shakeAmount -= shakeFadeOut;

			var x : float = Random.Range ( -shakeAmount, shakeAmount );
			var y : float = Random.Range ( -shakeAmount, shakeAmount );
		
			Camera.main.transform.position += new Vector3 ( x, y, 0 );			
		}

	}

	// Explosion
	public function ShakeCam ( amount : float, fadeOut : float ) {
		shakeAmount = amount;
		shakeFadeOut = fadeOut;
	}
	
	public function ExplosionDamage ( target : Vector3, radius : float, damage : float ) {
		var colliders : Collider[] = Physics.OverlapSphere ( target, radius );

		for ( var hit : Collider in colliders ) {
			/*if ( hit.rigidbody != null ) {
				hit.rigidbody.AddExplosionForce ( damage, target, radius, 3 );
			
				// Is it an actor?
				var a : OACharacter = hit.GetComponent(OACharacter);

				if ( a != null && a.health > 0 ) {
					var dist : float = (a.transform.position-target).sqrMagnitude;
					a.TakeDamage ( damage / dist );

					if ( a.health <= 0 ) {
						for ( var col : Collider in a.GetComponentsInChildren.< Collider > () ) {
							if ( col != hit ) {
								col.rigidbody.AddExplosionForce ( damage * 20, target, radius * 2, 1 );
							}
						}
					}
				}

				// Is it a mine?
				var m : OSGrenade = hit.GetComponent(OSGrenade);

				if ( m != null ) {
					m.Explode ();
				}
			}*/

			// Is it a destructible object?
			var destructible : ODDestructibleObject = hit.GetComponent.< ODDestructibleObject >();

			if ( destructible != null ) {
				destructible.Explode ( target, damage * 10, radius );
			}
		}

		ShakeCam ( 0.6, 0.03 );
	}
	
	public function SpawnExplosion ( target : Vector3, radius : float, damage : float )  {
		var explosion : GameObject = Instantiate ( prefabExplosion );

		explosion.transform.position = target;

		ExplosionDamage ( target, radius, damage );

		StartCoroutine ( DestroyDelayed ( explosion, 10 ) );
	}


}
