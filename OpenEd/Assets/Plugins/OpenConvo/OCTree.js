#pragma strict

public enum OCNodeType {
	Speak,
	Event,
	Jump,
	SetFlag,
	GetFlag,
	End
}

public class OCSpeaker {
	public var id : String = "newSpeaker";
	public var gameObject : GameObject;
}

public class OCTree extends MonoBehaviour {
	public var rootNodes : OCRootNode[] = new OCRootNode[1];
	public var currentRoot : int;
	public var speakers : OCSpeaker[] = new OCSpeaker[0];

	private static var random : System.Random = new System.Random ();

	public static function CreateID () : int {
		return random.Next ( 10000, 99999 );
	}

	public function GetSpeakerStrings () : String[] {
		var strings : String[] = new String [ speakers.Length ];

		for ( var i : int = 0; i < speakers.Length; i++ ) {
			strings[i] = speakers[i].id;
		}

		return strings;
	}

	public function AddSpeaker () {
		var tmpSpk : List.< OCSpeaker > = new List.< OCSpeaker > ( speakers );

		tmpSpk.Add ( new OCSpeaker () );

		speakers = tmpSpk.ToArray ();
	}

	public function RemoveSpeaker ( i : int ) {
		var tmpSpk : List.< OCSpeaker > = new List.< OCSpeaker > ( speakers );

		tmpSpk.RemoveAt ( i );

		speakers = tmpSpk.ToArray ();
	}

	public function SetSpeaker ( go : GameObject, i : int ) {
		if ( i < speakers.Length ) {
			speakers[i].gameObject = go;
		}
	}

	public function AddRootNode () {
		var tempNodes : List.< OCRootNode > = new List.< OCRootNode > ( rootNodes );

		tempNodes.Add ( new OCRootNode () );

		rootNodes = tempNodes.ToArray ();
	}
	
	public function RemoveRootNode ( i : int ) {
		if ( rootNodes.Length > 1 ) {
			var tempNodes : List.< OCRootNode > = new List.< OCRootNode > ( rootNodes );

			tempNodes.RemoveAt ( i );

			rootNodes = tempNodes.ToArray ();
		}
	}

	public function CurrentRootHasTag ( tag : String ) : boolean {
		for ( var t : String in rootNodes[currentRoot].tags ) {
			if ( t == tag ) {
				return true;
			}
		}

		return false;
	}
}

public class OCRootNode {
	public var tags : String[] = new String[0];
	public var firstNode : int;
	public var nodes : OCNode [] = new OCNode[0];

	public function ClearNodes () {
		nodes = new OCNode [0];
	}

	public function AddNode () : OCNode {
		var tmpNodes : List.< OCNode > = new List.< OCNode > ( nodes );
		var newNode : OCNode = new OCNode ();
		newNode.SetType ( OCNodeType.Speak );

		tmpNodes.Add ( newNode );

		nodes = tmpNodes.ToArray ();

		return newNode;
	}

	public function AddFirstNode () {
		var newNode : OCNode = AddNode ();

		firstNode = newNode.id;
	}
	
	public function RemoveNode ( id : int ) {
		var tmpNodes : List.< OCNode > = new List.< OCNode > ( nodes );

		for ( var i : int = 0; i < tmpNodes.Count; i++ ) {
			if ( tmpNodes[i].id == id ) {
				tmpNodes.RemoveAt ( i );
			}
		}
		
		nodes = tmpNodes.ToArray ();
	}

	public function GetNode ( id : int ) : OCNode {
		for ( var i : int = 0; i < nodes.Length; i++ ) {
			if ( nodes[i].id == id ) {
				return nodes[i];
			}
		}

		return null;
	}

	public function RemoveTag ( id : String ) {
		var tmpTags : List.< String > = new List.< String > ( tags );
		
		if ( tmpTags.Contains ( id ) ) {
			tmpTags.Remove ( id );
			tags = tmpTags.ToArray ();
		}
	}

	public function SetTag ( id : String ) {
		var tmpTags : List.< String > = new List.< String > ( tags );
		
		if ( !tmpTags.Contains ( id ) ) {
			tmpTags.Add ( id );
			tags = tmpTags.ToArray ();
		}
	}
	
	public function GetTag ( id : String ) : boolean {
		for ( var i : int = 0; i < tags.Length; i++ ) {
			if ( tags[i] == id ) {
				return true;
			}
		}

		return false;
	}
}

public class OCNode {
	public var connectedTo : int[] = new int[0];
	public var id : int;
	public var type : OCNodeType;

	public var speak : OCSpeak;
	public var event : OCEvent;
	public var jump : OCJump;
	public var setFlag : OCSetFlag;
	public var getFlag : OCGetFlag;
	public var end : OCEnd;

	function OCNode () {
		id = OCTree.CreateID ();
	}

	public function SetOutputAmount ( n : int ) {
		if ( n < 1 ) {
			connectedTo = new int[0];
		} else {
			var tmpConnect : List.< int > = new List.< int > ( connectedTo );
			
			if ( n > connectedTo.Length ) {
				for ( var i : int = connectedTo.Length; i < n; i++ ) {
					tmpConnect.Add ( 0 );
				}

				connectedTo = tmpConnect.ToArray ();
			
			} else if ( n < connectedTo.Length ) {
				for ( i = n; i < connectedTo.Length; i++ ) {
					tmpConnect.RemoveAt ( i );
				}
				
				connectedTo = tmpConnect.ToArray ();
				
			}
		}
	}

	public function Reset () {
		speak = null;
		event = null;
		jump = null;
		setFlag = null;
		getFlag = null;
		end = null;
	}

	public function SetType ( value : OCNodeType ) {
		if ( value != type ) {
			type = value;
			
			Reset ();

			switch ( type ) {
				case OCNodeType.Speak:
					speak = new OCSpeak ();
					SetOutputAmount ( 1 );
					break;
				
				case OCNodeType.Event:
					event = new OCEvent ();
					SetOutputAmount ( 1 );
					break;
				
				case OCNodeType.Jump:
					jump = new OCJump ();
					SetOutputAmount ( 0 );
					break;
				
				case OCNodeType.SetFlag:
					setFlag = new OCSetFlag ();
					SetOutputAmount ( 1 );
					break;
				
				case OCNodeType.GetFlag:
					getFlag = new OCGetFlag ();
					SetOutputAmount ( 2 );
					break;

				case OCNodeType.End:
					end = new OCEnd ();
					SetOutputAmount ( 0 );	
					break;
			}
		}
	}
}

public class OCSpeak {
	public var speaker : int;
	public var lines : String[] = new String[1];
	public var audio : AudioClip [] = new AudioClip[1];
}

public class OCEvent {
	public var message : String;
	public var argument : String;
	public var object : GameObject;
}

public class OCJump {
	public var rootNode : int;
}

public class OCEnd {
	public var rootNode : int;
}

public class OCSetFlag {
	public var flag : String;
	public var b : boolean;
}

public class OCGetFlag {
	public var flag : String;
}
