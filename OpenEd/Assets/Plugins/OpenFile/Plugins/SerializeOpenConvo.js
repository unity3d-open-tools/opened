#pragma strict

public class SerializeOpenConvo extends OFPlugin {
	override function get types () : System.Type[] {
		return [ typeof ( OCTree ) ];
	}

	override function Serialize ( component : Component ) : JSONObject {
		var input : OCTree = component as OCTree;

		if ( !input ) { return null; }
		
		var output : JSONObject = new JSONObject ( JSONObject.Type.OBJECT );
		var rootNodes : JSONObject = new JSONObject ( JSONObject.Type.ARRAY );
		var speakers : JSONObject = new JSONObject ( JSONObject.Type.ARRAY );

		for ( var speaker : OCSpeaker in input.speakers ) {
			var s : JSONObject = new JSONObject ( JSONObject.Type.OBJECT );
			s.AddField ( "id", speaker.id );
			speakers.Add ( s );
		}

		for ( var root : OCRootNode in input.rootNodes ) {
			var r : JSONObject = new JSONObject ( JSONObject.Type.OBJECT );
			var tags : JSONObject = new JSONObject ( JSONObject.Type.ARRAY );

			for ( var tag : String in root.tags ) {
				tags.Add ( tag );
			}
			
			var nodes : JSONObject = new JSONObject ( JSONObject.Type.ARRAY );
			
			for ( var node : OCNode in root.nodes ) {
				var n : JSONObject = new JSONObject ( JSONObject.Type.OBJECT );
				var connectedTo : JSONObject = new JSONObject ( JSONObject.Type.ARRAY );

				for ( var c : int in node.connectedTo ) {
					connectedTo.Add ( c );
				}

				n.AddField ( "id", node.id );
				n.AddField ( "type", node.type.ToString() );
				n.AddField ( "connectedTo", connectedTo );

				switch ( node.type ) {
					case OCNodeType.Speak:
						var speak : JSONObject = new JSONObject ( JSONObject.Type.OBJECT );
						var lines : JSONObject = new JSONObject ( JSONObject.Type.ARRAY );

						for ( var l : String in node.speak.lines ) {
							lines.Add ( l );
						}

						speak.AddField ( "speaker", node.speak.speaker );
						speak.AddField ( "lines", lines );

						n.AddField ( "speak", speak );
						
						break;

					case OCNodeType.Event:
						var event : JSONObject = new JSONObject ( JSONObject.Type.OBJECT );

						event.AddField ( "message", node.event.message );
						event.AddField ( "argument", node.event.argument );
						
						var prefabPath : String = "";
						
						if ( node.event.object && node.event.object.GetComponent.< OFSerializedObject > () ) {
							prefabPath = node.event.object.GetComponent.< OFSerializedObject > ().prefabPath;
						}

						event.AddField ( "object", prefabPath );

						n.AddField ( "event", event );

						break;

					case OCNodeType.Jump:
						var jump : JSONObject = new JSONObject ( JSONObject.Type.OBJECT );

						jump.AddField ( "rootNode", node.jump.rootNode );

						n.AddField ( "jump", jump );

						break;

					case OCNodeType.SetFlag:
						var setFlag : JSONObject = new JSONObject ( JSONObject.Type.OBJECT );
						
						setFlag.AddField ( "flag", node.setFlag.flag );
						setFlag.AddField ( "b", node.setFlag.b );

						n.AddField ( "setFlag", setFlag );
						
						break;

					case OCNodeType.GetFlag:
						var getFlag : JSONObject = new JSONObject ( JSONObject.Type.OBJECT );
						
						getFlag.AddField ( "flag", node.getFlag.flag );

						n.AddField ( "getFlag", getFlag );
						
						break;

					case OCNodeType.End:
						var end : JSONObject = new JSONObject ( JSONObject.Type.OBJECT );

						end.AddField ( "rootNode", node.end.rootNode );

						n.AddField ( "end", end );
						
						break;

				}

				nodes.Add ( n );
			}

			r.AddField ( "firstNode", root.firstNode );
			r.AddField ( "tags", tags );
			r.AddField ( "nodes", nodes );

			rootNodes.Add ( r );
		}

		output.AddField ( "rootNodes", rootNodes );
		output.AddField ( "speakers", speakers );
		output.AddField ( "currentRoot", input.currentRoot );

		return output;
	}
	
	override function Deserialize ( input : JSONObject, component : Component ) {
		var tree : OCTree = component as OCTree;

		if ( !tree ) { return; }
		
		var rootNodes : List.< OCRootNode > = new List.< OCRootNode > ();
		var speakers : List.< OCSpeaker > = new List.< OCSpeaker > ();

		for ( var speaker : JSONObject in input.GetField ( "speakers" ).list ) {
			var s : OCSpeaker = new OCSpeaker ();
			s.id = speaker.GetField ( "id" ).str;
			speakers.Add ( s );
		}

		for ( var root : JSONObject in input.GetField ( "rootNodes" ).list ) {
			var r : OCRootNode = new OCRootNode ();
			var tags : List.< String > = new List.< String >();

			for ( var tag : JSONObject in root.GetField ( "tags" ).list ) {
				tags.Add ( tag.str );
			}

			var nodes : List.< OCNode > = new List.< OCNode > ();

			for ( var node : JSONObject in root.GetField ( "nodes" ).list ) {
				var n : OCNode = new OCNode ();
				var connectedTo : List.< int > = new List.< int > ();

				for ( var c : JSONObject in node.GetField ( "connectedTo" ).list ) {
					connectedTo.Add ( c.n );
				}

				n.id = node.GetField ( "id" ).n;
				n.type = OFDeserializer.ParseEnum ( typeof ( OCNodeType ), node.GetField ( "type" ).str );
				n.connectedTo = connectedTo.ToArray ();

				switch ( n.type ) {
					case OCNodeType.Speak:
						var speak : OCSpeak = new OCSpeak ();
						var lines : List.< String > = new List.< String > ();

						for ( var l : JSONObject in node.GetField ( "speak" ).GetField ( "lines" ).list ) {
							lines.Add ( l.str );
						}

						speak.speaker = node.GetField ( "speak" ).GetField ( "speaker" ).n;
						speak.lines = lines.ToArray ();
						
						n.speak = speak;

						break;

					case OCNodeType.Event:
						var event : OCEvent = new OCEvent ();

						event.message = node.GetField ( "event" ).GetField ( "message" ).str;
						event.argument = node.GetField ( "event" ).GetField ( "argument" ).str;
						event.object = Resources.Load ( node.GetField ( "event" ).GetField ( "object" ).str ) as GameObject;

						n.event = event;

						break;

					case OCNodeType.Jump:
						var jump : OCJump = new OCJump ();
				
						jump.rootNode = node.GetField ( "jump" ).GetField ( "rootNode" ).n;

						n.jump = jump;

						break;

					case OCNodeType.SetFlag:
						var setFlag : OCSetFlag = new OCSetFlag ();

						setFlag.flag = node.GetField ( "setFlag" ).GetField ( "flag" ).str;
						setFlag.b = node.GetField ( "setFlag" ).GetField ( "b" ).b;

						n.setFlag = setFlag;

						break;
					
					case OCNodeType.GetFlag:
						var getFlag : OCGetFlag = new OCGetFlag ();

						getFlag.flag = node.GetField ( "getFlag" ).GetField ( "flag" ).str;

						n.getFlag = getFlag;

						break;

					case OCNodeType.End:
						var end : OCEnd = new OCEnd ();
				
						end.rootNode = node.GetField ( "end" ).GetField ( "rootNode" ).n;

						n.end = end;

						break;
				}

				nodes.Add ( n );
			}

			r.firstNode = root.GetField ( "firstNode" ).n;
			r.tags = tags.ToArray ();
			r.nodes = nodes.ToArray ();

			rootNodes.Add ( r );
		}

		tree.speakers = speakers.ToArray ();
		tree.rootNodes = rootNodes.ToArray ();
		tree.currentRoot = input.GetField ( "currentRoot" ).n;
	}
}
