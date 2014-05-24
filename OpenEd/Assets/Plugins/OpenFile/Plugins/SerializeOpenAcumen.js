#pragma strict

public class SerializeOpenAcumen extends OFPlugin {
	override function get types () : System.Type[] {
		return [ typeof ( OACharacter ), typeof ( OATrigger ) ];
	}
	
	private function SerializeCharacter ( input : OACharacter ) : JSONObject {
		var output : JSONObject = new JSONObject ( JSONObject.Type.OBJECT );
	
		output.AddField ( "health", input.health );

		// Inventory
		output.AddField ( "usingWeapons", input.usingWeapons );
		output.AddField ( "weaponCategoryPreference", input.weaponCategoryPreference );
		output.AddField ( "weaponSubcategoryPreference", input.weaponSubcategoryPreference );

		// Conversation
		if ( input.conversationTree ) {
			output.AddField ( "conversationTree", OFSerializer.GetPlugin( typeof ( OCTree ) ).Serialize ( input.conversationTree ) );
		
			var speakers : JSONObject = new JSONObject ( JSONObject.Type.ARRAY );

			for ( var i : int = 0; i < input.convoSpeakers.Length; i++ ) {
				var go : GameObject = input.convoSpeakers[i];
				var so : OFSerializedObject;

				if ( go ) {
					so = go.GetComponent.< OFSerializedObject > ();
				}

				if ( so ) {
					speakers.Add ( so.id );
				
				} else {
					speakers.Add ( "" );
				
				}
			}

			output.AddField ( "convoSpeakers", speakers );
		}

		// Path
		output.AddField ( "updatePathInterval", input.updatePathInterval );
		
		var pathGoals : JSONObject = new JSONObject ( JSONObject.Type.ARRAY );
		
		for ( i = 0; i < input.pathGoals.Length; i++ ) {
			pathGoals.Add ( OFSerializer.Serialize ( input.pathGoals[i] ) );
		}

		output.AddField ( "pathGoals", pathGoals );

		return output;
	}
	
	private function SerializeTrigger ( input : OATrigger ) : JSONObject {
		var output : JSONObject = new JSONObject ( JSONObject.Type.OBJECT );

		output.AddField ( "type", input.type.ToString() );
		output.AddField ( "message", input.message );
		output.AddField ( "argument", input.argument );
		output.AddField ( "fireOnce", input.fireOnce );
		output.AddField ( "isActive", input.isActive );
		output.AddField ( "eventToTarget", input.eventToTarget );

		var go : GameObject = input.object;
		var so : OFSerializedObject;

		if ( go ) {
			so = go.GetComponent.< OFSerializedObject > ();
		}

		if ( so ) {
			output.AddField ( "object", so.id );
		
		} else {
			output.AddField ( "object", "" );
		
		}

		return output;
	}

	override function Serialize ( component : Component ) : JSONObject {
		var character : OACharacter = component as OACharacter;
		var trigger : OATrigger = component as OATrigger;

		if ( character ) {
			return SerializeCharacter ( character );

		} else if ( trigger ) {
			return SerializeTrigger ( trigger );

		} else {
			return null;

		}
	}
	
	private function DeserializeCharacter ( input : JSONObject, output : OACharacter ) {
		output.health = input.GetField ( "health" ).n;
		output.usingWeapons = input.GetField ( "usingWeapons" ).b;

		// Inventory
		if ( output.usingWeapons ) {
			output.weaponCategoryPreference = input.GetField ( "weaponCategoryPreference" ).n;
			output.weaponSubcategoryPreference = input.GetField ( "weaponSubcategoryPreference" ).n;
		}

		// Conversation
		if ( input.HasField ( "conversationTree" ) ) {
			if ( !output.conversationTree ) {
				output.conversationTree = output.gameObject.AddComponent.< OCTree > ();
			}

			OFSerializer.GetPlugin ( typeof ( OCTree ) ).Deserialize ( input.GetField ( "conversationTree" ), output.conversationTree );		
		
			var speakerList : List.< JSONObject > = input.GetField ( "convoSpeakers" ).list;

			output.convoSpeakers = new GameObject [ speakerList.Count ];
			
			for ( var i : int = 0; i < speakerList.Count; i++ ) {
				OFDeserializer.DeferConnection ( function ( so : OFSerializedObject, index : int ) {
					if ( so ) {
						output.convoSpeakers[index] = so.gameObject;
					}
				}, speakerList[i].str, i );
			}
		}

		// Path
		output.updatePathInterval = input.GetField ( "updatePathInterval" ).n;

		var goalList : List.< JSONObject > = input.GetField ( "pathGoals" ).list;

		output.pathGoals = new Vector3 [ goalList.Count ];
		for ( i = 0; i < goalList.Count; i++ ) {
			output.pathGoals[i] = OFDeserializer.DeserializeVector3 ( goalList[i] );
		}
	}
	
	private function DeserializeTrigger ( input : JSONObject, output : OATrigger ) {
		output.type = OFDeserializer.ParseEnum ( OATriggerType, input.GetField ( "type" ).str );
		output.message = input.GetField ( "message" ).str;
		output.argument = input.GetField ( "argument" ).str;
		OFDeserializer.DeferConnection ( function ( so : OFSerializedObject ) {
			if ( so ) {
				output.object = so.gameObject;
			}
		}, input.GetField ( "object" ).str );
		output.fireOnce = input.GetField ( "fireOnce" ).b;
		output.isActive = input.GetField ( "isActive" ).b;
		output.eventToTarget = input.GetField ( "eventToTarget" ).b;
	}
	
	override function Deserialize ( input : JSONObject, component : Component ) {
		var character : OACharacter = component as OACharacter;
		var trigger : OATrigger = component as OATrigger;

		if ( character ) {
			DeserializeCharacter ( input, character );

		} else if ( trigger ) {
			DeserializeTrigger ( input, trigger );

		}
	}
}
