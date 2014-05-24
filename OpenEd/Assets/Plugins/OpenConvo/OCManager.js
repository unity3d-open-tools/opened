#pragma strict

public class OCManager extends MonoBehaviour {
	public var flags : OCFlags = new OCFlags ();
	public var tree : OCTree;
	public var currentNode : int;
	public var eventHandler : GameObject;

	private var speaker : OCSpeaker;

	public static var instance : OCManager;

	public static function GetInstance () : OCManager {
		return instance;
	}

	private function DoCallback ( message : String, object : Object ) {	
		if ( eventHandler ) {
			eventHandler.SendMessage ( message, object, SendMessageOptions.DontRequireReceiver );
		}
	}
	
	private function DoCallback ( message : String, argument : String ) {
		if ( eventHandler ) {
			eventHandler.SendMessage ( message, argument, SendMessageOptions.DontRequireReceiver );
		}
	}
	
	public function get optionCount () : int {
		var node : OCNode = tree.rootNodes[tree.currentRoot].GetNode ( currentNode );
		
		if ( node && node.speak && node.type == OCNodeType.Speak ) {
			return node.speak.lines.Length;
		
		} else {
			return 0;
		
		}
	}

	public function Start () {
		instance = this;
	}

	public function EndConversation () {
		tree = null;
		
		DoCallback ( "OnConversationEnd", speaker );
	}

	public function DisplayNode () {
		var node : OCNode = tree.rootNodes[tree.currentRoot].GetNode ( currentNode );
		var wait : boolean = false;
		var exit : boolean = false;
		var nextNode : int;

		switch ( node.type ) {
			case OCNodeType.Jump:
				tree.currentRoot = node.jump.rootNode;
				nextNode = tree.rootNodes[tree.currentRoot].firstNode;
				break;

			case OCNodeType.Speak:
				speaker = tree.speakers [ node.speak.speaker ];
				wait = true;
				break;

			case OCNodeType.Event:
				if ( !String.IsNullOrEmpty ( node.event.argument ) ) {
					DoCallback ( node.event.message, node.event.argument );

				} else if ( node.event.object != null ) {
					DoCallback ( node.event.message, node.event.object );

				} else {
					DoCallback ( node.event.message, tree );
				
				}

				nextNode = node.connectedTo[0];
				break;

			case OCNodeType.SetFlag:
				flags.Set ( node.setFlag.flag, node.setFlag.b );
			
				nextNode = node.connectedTo[0];
				break;

			case OCNodeType.GetFlag:
				if ( flags.Get ( node.getFlag.flag ) ) {
					nextNode = node.connectedTo[1];

				} else {
					nextNode = node.connectedTo[0];

				}
				break;

			case OCNodeType.End:
				tree.currentRoot = node.end.rootNode;
				exit = true;
				break;
		}

		if ( exit ) {
			EndConversation ();

		} else if ( !wait ) {
			currentNode = nextNode;
			DisplayNode ();
		
		} else if ( node && node.speak ) {
			DoCallback ( "OnSetLines", node.speak.lines );
			DoCallback ( "OnSetSpeaker", speaker );
		
		}
	}

	public function SelectOption ( i : int ) {
		currentNode = tree.rootNodes[tree.currentRoot].GetNode(currentNode).connectedTo[i];
		DisplayNode ();
	}

	public function NextNode () {
		currentNode = tree.rootNodes[tree.currentRoot].GetNode(currentNode).connectedTo[0];
		DisplayNode ();
	}

	public function StartConversation ( tree : OCTree ) {
		if ( !this.tree && tree && tree.rootNodes.Length > 0 ) {
			this.tree = tree;

			currentNode = tree.rootNodes[tree.currentRoot].firstNode;
			
			DoCallback ( "OnConversationStart", tree );

			DisplayNode ();
		}
	}
}
