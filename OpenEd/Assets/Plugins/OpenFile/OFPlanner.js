#pragma strict

public class OFPlanner extends MonoBehaviour {
	public class Connection {
		public var callback : Action.< OFSerializedObject >;
		public var callbackWithIndex : Action.< OFSerializedObject, int >;
		public var callbackWithIndices : Action.< OFSerializedObject, int[] >;
		public var id : String;
		public var index : int = -1;
		public var indices : int [];

		function Connection ( callback : Action.< OFSerializedObject >, id : String ) {
			this.callback = callback;
			this.id = id;
		}
		
		function Connection ( callback : Action.< OFSerializedObject, int >, id : String, index : int ) {
			this.callbackWithIndex = callback;
			this.id = id;
			this.index = index;
		}
		
		function Connection ( callback : Action.< OFSerializedObject, int [] >, id : String, indices : int [] ) {
			this.callbackWithIndices = callback;
			this.id = id;
			this.indices = indices;
		}
	}

	private var allConnections : List.< Connection > = new List.< Connection > ();
	private var spawnedObjects : List.< OFSerializedObject > = new List.< OFSerializedObject > ();

	public function AddObject ( so : OFSerializedObject ) {
		spawnedObjects.Add ( so );
	}

	public function DeferConnection ( callback : Action.< OFSerializedObject >, id : String ) {
		allConnections.Add ( new Connection ( callback, id ) );
	}
	
	public function DeferConnection ( callback : Action.< OFSerializedObject, int >, id : String, index : int ) {
		allConnections.Add ( new Connection ( callback, id, index ) );
	}
	
	public function DeferConnection ( callback : Action.< OFSerializedObject, int [] >, id : String, indices : int [] ) {
		allConnections.Add ( new Connection ( callback, id, indices ) );
	}

	public function FindObject ( id : String ) : OFSerializedObject {
		for ( var so : OFSerializedObject in spawnedObjects ) {
			if ( so.id == id ) {
				return so;
			}
		}

		return null;
	}

	private function MakeConnections () : IEnumerator {
		yield WaitForEndOfFrame ();
		
		for ( var c : Connection in allConnections ) {
			var so : OFSerializedObject = FindObject ( c.id );
			
			if ( so ) {
				if ( c.callbackWithIndex ) {
					c.callbackWithIndex ( so, c.index );
				
				} else if ( c.callbackWithIndices ) {
					c.callbackWithIndices ( so, c.indices );
				
				} else {
					c.callback ( so );
				
				}
			}
		}
		
		yield WaitForEndOfFrame ();
		
		Destroy ( gameObject );
	}

	public function ConnectAll () {
		StartCoroutine ( MakeConnections () );
	}
}
