#pragma strict

public class OACharacterInspector extends OEComponentInspector {
	override function get type () : System.Type { return typeof ( OACharacter ); }
	
	override function Inspector () {
		var character : OACharacter = target.GetComponent.< OACharacter >();
	
		character.isEnemy = Toggle ( "Is enemy", character.isEnemy );
		character.behaviour = Popup ( "Behaviour", character.behaviour, System.Enum.GetNames ( typeof ( OABehaviour ) ) );
		
		// Inventory
		if ( character.inventory ) {
			Offset ( 0, 20 );
			character.usingWeapons = Toggle ( "Using weapons", character.usingWeapons );
			
			if ( character.usingWeapons ) {
				character.weaponCategoryPreference = Popup ( "Preference", character.weaponCategoryPreference, character.inventory.definitions.GetCategoryStrings () );
				character.weaponSubcategoryPreference = Popup ( " ", character.weaponSubcategoryPreference, character.inventory.definitions.GetSubcategoryStrings ( character.weaponCategoryPreference ) );
			}
		}

		// Conversation
		Offset ( 0, 20 );
		
		character.conversationTree = ObjectField ( "Tree", character.conversationTree, typeof ( OCTree ), ".tree", character.GetComponent.< OFSerializedObject > () ) as OCTree;

		BeginDisabled ( character.conversationTree == null );

		var rootNodeStrings : String[] = new String[0];
		var speakerStrings : String[] = new String[0];
	
		if ( character.conversationTree ) {
			rootNodeStrings = new String[character.conversationTree.rootNodes.Length];
			for ( var i : int = 0; i < rootNodeStrings.Length; i++ ) {
				rootNodeStrings[i] = i.ToString();
			}
			
			if ( character.convoSpeakers.Length != character.conversationTree.speakers.Length ) {
				character.convoSpeakers = new GameObject [ character.conversationTree.speakers.Length ];
			}
		
			speakerStrings = character.conversationTree.GetSpeakerStrings ();
	
		} else {	
			character.convoSpeakers = new GameObject [ 0 ];

		}

		character.convoRootNode = Popup ( "First root node", character.convoRootNode, rootNodeStrings );	

		for ( i = 0; i < speakerStrings.Length; i++ ) {
			character.convoSpeakers[i] = ObjectField ( speakerStrings[i], character.convoSpeakers[i], typeof ( GameObject ), OEObjectField.Target.Scene ) as GameObject;
		}

		EndDisabled ();

		// Path
		Offset ( 0, 20 );

		character.updatePathInterval = FloatField ( "Path update interval", character.updatePathInterval );

		for ( i = 0; i < character.pathGoals.Length; i++ ) {
			character.pathGoals[i] = PointField ( "Goal #" + i.ToString(), character.pathGoals[i] );
		}

		if ( Button ( "Add" ) ) {
			var tmpGoals : List.< Vector3 > = new List.< Vector3 > ( character.pathGoals );
			tmpGoals.Add ( character.pathGoals.Length > 0 ? character.pathGoals[character.pathGoals.Length-1] : character.transform.position );
			character.pathGoals = tmpGoals.ToArray ();
		}

		if ( Button ( "Remove" ) ) {
			if ( character.pathGoals.Length > 0 ) {
				tmpGoals = new List.< Vector3 > ( character.pathGoals );
				tmpGoals.RemoveAt ( tmpGoals.Count - 1 );
				character.pathGoals = tmpGoals.ToArray ();
			}
		}
	
	}	
}
