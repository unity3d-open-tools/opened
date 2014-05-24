#pragma strict

public enum OSProjectileType {
	Raycast,
	Prefab
}
	
public class OSProjectile extends MonoBehaviour {
	public var layerMask : LayerMask;
	public var raycastDistance : float = 0.25;
	public var speed : float = 1;
	public var visibilityByTimeScale : boolean = false;
	public var maxTimeScale : float = 0.9;
	public var renderers : Renderer [] = new Renderer [0];

	@HideInInspector public var lifetime : float = 2;
	@HideInInspector public var damage : float = 0;

	public function Update () {
		lifetime -= Time.deltaTime;

		if ( lifetime < 0 ) {
			Destroy ( this.gameObject );
		
		} else {
			if ( visibilityByTimeScale ) {
				for ( var i : int = 0; i < renderers.Length; i++ ) {
					renderers[i].enabled = Time.timeScale <= maxTimeScale;
				}
			}

			this.transform.position += ( this.transform.forward * speed ) * Time.deltaTime;
			
			var hit : RaycastHit;
			
			if ( Physics.Raycast ( this.transform.position, this.transform.forward, hit, raycastDistance, layerMask ) ) {
				this.transform.position = hit.point;
				lifetime = 0;

				hit.collider.gameObject.SendMessage ( "OnProjectileHit", damage, SendMessageOptions.DontRequireReceiver );
			}
		
		}
	}

	public static function Fire ( p : OSProjectile, range : float, damage : float, position : Vector3, ray : Ray ) {
		var projectile : OSProjectile = Instantiate ( p );

		projectile.lifetime = range / projectile.speed;
		projectile.damage = damage;
		projectile.transform.position = position;
		
		var hit : RaycastHit;

		if ( Physics.Raycast ( ray, hit, Mathf.Infinity, projectile.layerMask ) ) {
			projectile.transform.LookAt ( hit.point );
		}
	}
}
