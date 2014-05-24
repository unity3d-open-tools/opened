#pragma strict

public enum OATriggerType {
	OnCollision,
	OnDeath,
	OnDestruction
}

public class OATrigger extends MonoBehaviour {
	public var eventHandler : GameObject;
	public var type : OATriggerType;
	public var message : String;
	public var argument : String;
       	public var object : GameObject;
	public var isActive : boolean = true;
	public var fireOnce : boolean = true;
	public var eventToTarget : boolean = false;

	private var character : OACharacter;

	public function ToggleActive () {
		isActive = !isActive;
	}

	public function Fire () {
		if ( object && eventToTarget ) {
			eventHandler = object;
		}
		
		if ( eventHandler ) {
			if ( !String.IsNullOrEmpty ( message ) ) {
				if ( object && !eventToTarget ) {
					eventHandler.SendMessage ( message, object, SendMessageOptions.DontRequireReceiver );

				} else if ( !String.IsNullOrEmpty ( argument ) ) {
					eventHandler.SendMessage ( message, argument, SendMessageOptions.DontRequireReceiver );
					
				} else {
					eventHandler.SendMessage ( message, SendMessageOptions.DontRequireReceiver );

				}
			}
			
			if ( fireOnce && type != OATriggerType.OnDestruction ) {
				Destroy ( this.gameObject );
			}
		}
	}

	public function OnTriggerEnter () {
		if ( isActive && type == OATriggerType.OnCollision ) {
			Fire ();
		}
	}

	public function OnDestroy () {
		if ( isActive && type == OATriggerType.OnDestruction ) {
			Fire ();
		}
	}

	public function Start () {
		character = this.GetComponent.< OACharacter > ();
	}

	public function Update () {
		if ( isActive && character && character.health >= 0 && type == OATriggerType.OnDeath ) {
			Fire ();
		}
	}
}
