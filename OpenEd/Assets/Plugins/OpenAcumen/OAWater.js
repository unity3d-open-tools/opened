#pragma strict

public class OAWater extends MonoBehaviour {
	public function OnTriggerEnter ( c : Collider ) {
		c.gameObject.SendMessage ( "OnWaterEnter", SendMessageOptions.DontRequireReceiver );
	
		Debug.Log ( c );

		var rb : Rigidbody = c.gameObject.GetComponentInChildren.< Rigidbody > ();
	
		if ( rb ) {
			rb.useGravity = false;
		}
	}

	public function OnTriggerExit ( c : Collider ) {
		c.gameObject.SendMessage ( "OnWaterExit", SendMessageOptions.DontRequireReceiver );
		
		var rb : Rigidbody = c.gameObject.GetComponentInChildren.< Rigidbody > ();

		if ( rb ) {
			rb.useGravity = true;
		}
	}
}
