#pragma strict

public class OCGameEvent {
	public var handler : GameObject;
	public var message : String;
	public var argument : String;
	public var object : Object;

	public function Fire () {
		if ( handler ) {
			if ( object ) {
				handler.SendMessage ( message, object, SendMessageOptions.DontRequireReceiver );
			
			} else if ( !String.IsNullOrEmpty ( argument ) ) {
				handler.SendMessage ( message, argument, SendMessageOptions.DontRequireReceiver );
			
			} else {
				handler.SendMessage ( message, SendMessageOptions.DontRequireReceiver );

			}
		}
	}
}
