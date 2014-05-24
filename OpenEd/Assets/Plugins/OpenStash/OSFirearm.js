#pragma strict

public class OSFirearm extends MonoBehaviour {
	@HideInInspector public var item : OSItem;
	@HideInInspector public var accuracyIndex : int;
	@HideInInspector public var damageIndex : int;
	@HideInInspector public var firingRateIndex : int;
	@HideInInspector public var reloadSpeedIndex : int;
	@HideInInspector public var rangeIndex : int;
	@HideInInspector public var firingSoundIndex : int;
	@HideInInspector public var reloadSoundIndex : int;
	@HideInInspector public var equippingSoundIndex : int;
	@HideInInspector public var holsteringSoundIndex : int;
	
	public var muzzleFlash : GameObject;
	public var muzzleFlashDuration : float = 0.25;
	public var projectileType : OSProjectileType;
	public var aimWithMainCamera : boolean = true;

	private var fireTimer : float = 0;
	private var flashTimer : float = 0;
	private var inventory : OSInventory;
	private var bullet : OSProjectile;

	public function SetInventory ( inventory : OSInventory ) {
		this.inventory = inventory;
	}

	public function get accuracy () : float {
		return item.attributes[accuracyIndex].value;
	}
	
	public function get damage () : float {
		return item.attributes[damageIndex].value;
	}

	public function get firingRate () : float {
		return item.attributes[firingRateIndex].value;
	}
	
	public function get range () : float {
		return item.attributes[rangeIndex].value;
	}
	
	public function get firingSound () : AudioClip {
		return item.sounds[firingSoundIndex];
	}

	public function get reloadSpeed () : float {
		return item.attributes[reloadSpeedIndex].value;
	}
	
	public function get reloadSound () : AudioClip {
		return item.sounds[reloadSoundIndex];
	}

	public function get equippingSound () : AudioClip {
		return item.sounds[equippingSoundIndex];
	}
	
	public function get holsteringSound () : AudioClip {
		return item.sounds[holsteringSoundIndex];
	}

	public function Fire () {
		if ( fireTimer <= 0 ) {
			fireTimer = 1 / firingRate;
			flashTimer = muzzleFlashDuration;

			var ray : Ray;
			var pos : Vector3;

			if ( muzzleFlash ) {
				pos = muzzleFlash.transform.position;
			
			} else {
				pos = this.transform.position;
			
			}

			if ( aimWithMainCamera ) {
				ray = new Ray ( Camera.main.transform.position, Camera.main.transform.forward );

			} else {
				ray = new Ray ( pos, this.transform.forward );

			}

			if ( projectileType == OSProjectileType.Prefab && bullet ) {
				OSProjectile.Fire ( bullet, range, damage, pos, ray );
			
			} else {
				var hit : RaycastHit;

				if ( Physics.Raycast ( ray, hit, range ) ) {
					hit.collider.gameObject.SendMessage ( "OnProjectileHit", damage );
				}

			}

			item.PlaySound ( firingSoundIndex );
		}
	}

	public function Start () {
		if ( muzzleFlash ) {
			muzzleFlash.SetActive ( false );
		}
	}

	public function Update () {
		if ( !item ) {
			item = this.GetComponent.< OSItem > ();
			return;
		}

		if ( !bullet ) {
			bullet = item.ammunition.projectile;
		}

		if ( fireTimer > 0 ) {
			fireTimer -= Time.deltaTime;
		}

		if ( flashTimer > 0 ) {
			flashTimer -= Time.deltaTime;
		}

		if ( muzzleFlash ) {
			muzzleFlash.SetActive ( flashTimer > 0 );
		}
	}	
}
