#pragma strict

public class OSGrenade extends MonoBehaviour {
	public enum ExplodeTrigger {
		None,
		Timed,
		OnCollision
	}

	@HideInInspector public var item : OSItem;
	
	@HideInInspector public var firingRateIndex : int = 0;
	@HideInInspector public var damageIndex : int = 0;
	@HideInInspector public var rangeIndex : int = 0;
	
	@HideInInspector public var equippingSoundIndex : int = 0;
	@HideInInspector public var explodingSoundIndex : int = 0;
	@HideInInspector public var holsteringSoundIndex : int = 0;
	@HideInInspector public var throwingSoundIndex : int = 0;

	public var countdown : float = 5;
	public var trigger : ExplodeTrigger;
	public var armed : boolean = false;
	public var sticky : boolean = false;
	public var explosion : GameObject;
	public var explosionLifetime : float = 5;
	public var throwingForce : float = 20;
	public var eventHandler : GameObject;

	private var thrown : boolean = false;
	private var exploded : boolean = false;
	private var inventory : OSInventory;
	private var bezier : Bezier;
	private var bezierTimer : float;
	private var distance : float;
	private var startNormal : Vector3;
	private var endNormal : Vector3;
	private var hit : RaycastHit;
	private var lineRenderer : LineRenderer;
	
	public function get range () : float {
		return item.attributes[rangeIndex].value;
	}
	
	public function get damage () : float {
		return item.attributes[damageIndex].value;
	}

	public function SetInventory ( inventory : OSInventory ) {
		this.inventory = inventory;
	}

	public function Throw () {
		if ( !bezier ) { return; }
		
		this.transform.parent = this.transform.root.parent;
		
		thrown = true;
		
		if ( collider ) {
			collider.enabled = true;
		}
		
		startNormal = this.transform.up;

		if ( lineRenderer ) {
			lineRenderer.enabled = false;
		}

		inventory.DecreaseItem ( this as OSItem );
	}

	public function Aim ( pos : Vector3, dir : Vector3 ) {
		if ( thrown ) { return; }
		
		if ( Physics.Raycast ( pos, dir, hit, range ) ) {
			endNormal = hit.normal;
			bezier = new Bezier ( this.transform.position, dir, Vector3.up, hit.point );
		
		} else if ( Physics.Raycast ( pos + dir * range, Vector3.down, hit, Mathf.Infinity ) ) {
			endNormal = hit.normal;
			bezier = new Bezier ( this.transform.position, dir, Vector3.up, hit.point );
		
		}

		if ( lineRenderer && bezier ) {
			lineRenderer.SetVertexCount ( 32 );
			
			for ( var i : int = 0; i < 32; i++ ) {
				var time : float = ( i * 1.0 ) * ( 1.0 / 32 );

				lineRenderer.SetPosition ( i, bezier.GetPointAtTime ( time ) );
			}
		}

		distance = Vector3.Distance ( pos, hit.point ); 
	}

	public function Explode () {
		if ( !exploded && explosion ) {
			if ( explosion.activeInHierarchy ) {
				explosion.SetActive ( true );
				explosion.transform.parent = this.transform.parent;
				explosion.transform.position = this.transform.position;
			
			} else {
				explosion = Instantiate ( explosion ) as GameObject;
				explosion.transform.parent = this.transform.parent;
				explosion.transform.position = this.transform.position;
		
			}
			
			if ( eventHandler ) {
				eventHandler.SendMessage ( "OnExplosion", this, SendMessageOptions.DontRequireReceiver );
			}
			
		}

		exploded = true;
	}

	public function OnCollisionEnter () {
		if ( armed && trigger == ExplodeTrigger.OnCollision ) {
			Explode ();
		}
	}

	public function Start () {
		lineRenderer = this.GetComponent.< LineRenderer > ();
	}

	public function Update () {
		if ( exploded ) {
			if ( renderer ) {
				renderer.enabled = false;
			}
			
			if ( explosionLifetime <= 0 ) {
				Destroy ( this.gameObject );
				Destroy ( explosion );

			} else {
				explosionLifetime -= Time.deltaTime;

			}
		
		} else if ( armed ) {
			if ( trigger == ExplodeTrigger.Timed ) {
				Explode ();
			}
		
		} else if ( thrown ) {
			if ( bezierTimer > 1 ) {
				bezierTimer = 1;
			}

			if ( sticky ) {
				this.transform.up = Vector3.Lerp ( startNormal, endNormal, bezierTimer );
			
			}

			var revolutions : int = Mathf.RoundToInt ( ( distance * 2 ) / throwingForce );

			this.transform.localEulerAngles -= new Vector3 ( 0, 0, 360 * revolutions ) * bezierTimer;

			if ( countdown <= 0 ) {
				armed = true;
			
			} else {
				countdown -= Time.deltaTime;
			
			}

			if ( bezierTimer >= 1 ) {
				if ( !sticky && rigidbody ) {	
					rigidbody.useGravity = true;
					rigidbody.isKinematic = false;
				}
			
			} else {
				this.transform.position = bezier.GetPointAtTime ( bezierTimer );
				
				bezierTimer += Time.deltaTime * ( throwingForce / distance );

			}

		}
	}
}
