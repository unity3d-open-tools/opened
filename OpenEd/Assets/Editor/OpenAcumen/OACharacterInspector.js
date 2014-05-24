#pragma strict

@CustomEditor ( OACharacter )
public class OACharacterInspector extends Editor {
	private function SavePrefab ( target : UnityEngine.Object ) {
		var selectedGameObject : GameObject;
		var selectedPrefabType : PrefabType;
		var parentGameObject : GameObject;
		var prefabParent : UnityEngine.Object;
		     
		selectedGameObject = Selection.gameObjects[0];
		selectedPrefabType = PrefabUtility.GetPrefabType(selectedGameObject);
		parentGameObject = selectedGameObject.transform.root.gameObject;
		prefabParent = PrefabUtility.GetPrefabParent(selectedGameObject);
		     
		EditorUtility.SetDirty(target);
		     
		if (selectedPrefabType == PrefabType.PrefabInstance) {
			PrefabUtility.ReplacePrefab(parentGameObject, prefabParent,
			ReplacePrefabOptions.ConnectToPrefab);
	    	}
	}
	
	override function OnInspectorGUI () {
		var character : OACharacter = target as OACharacter;

		if ( !character.pathFinder ) {
			character.pathFinder = character.GetComponent.< OPPathFinder > ();
			EditorGUILayout.LabelField ( "Character has no OPPathFinder component" );
			EditorGUILayout.Space ();
		}
		
		character.isEnemy = EditorGUILayout.Toggle ( "Is enemy", character.isEnemy );

		character.behaviour = EditorGUILayout.Popup ( "Behaviour", character.behaviour, System.Enum.GetNames ( OABehaviour ) );

		EditorGUILayout.BeginHorizontal ();
		character.updatePathInterval = EditorGUILayout.FloatField ( "Update path every", character.updatePathInterval );
		EditorGUILayout.LabelField ( "seconds", GUILayout.Width ( 50 ) );
		EditorGUILayout.EndHorizontal ();
		
		EditorGUILayout.Space ();
		EditorGUILayout.LabelField ( "Inventory", EditorStyles.boldLabel );
			
		if ( !character.inventory ) {
			character.inventory = character.GetComponent.< OSInventory > ();
			EditorGUILayout.LabelField ( "Character has no OSInventory component" );
			EditorGUILayout.Space ();
		
		} else if ( character.inventory.definitions ) { 
			character.usingWeapons = EditorGUILayout.Toggle ( "Using weapons", character.usingWeapons );

			if ( character.usingWeapons ) {
				EditorGUILayout.BeginHorizontal ();
				character.weaponCategoryPreference = EditorGUILayout.Popup ( "Weapon preference", character.weaponCategoryPreference, character.inventory.definitions.GetCategoryStrings () );
				character.weaponSubcategoryPreference = EditorGUILayout.Popup ( character.weaponSubcategoryPreference, character.inventory.definitions.GetSubcategoryStrings ( character.weaponCategoryPreference ), GUILayout.Width ( 120 ) );
				EditorGUILayout.EndHorizontal ();
			}
		}

		EditorGUILayout.Space ();
		EditorGUILayout.LabelField ( "Conversation", EditorStyles.boldLabel );
			
		if ( character.gameObject.activeInHierarchy ) {
			character.conversationTree = EditorGUILayout.ObjectField ( "Conversation tree", character.conversationTree, typeof ( OCTree ), false ) as OCTree;
		
			if ( character.conversationTree != null ) {
				var rootNodeStrings : String[] = new String[character.conversationTree.rootNodes.Length];
				for ( var i : int = 0; i < rootNodeStrings.Length; i++ ) {
					rootNodeStrings[i] = i.ToString();
				}
				
				character.convoRootNode = EditorGUILayout.Popup ( "Starting root node", character.convoRootNode, rootNodeStrings );	
		
				if ( !character.gameObject.activeInHierarchy || character.convoSpeakers.Length != character.conversationTree.speakers.Length ) {
					character.convoSpeakers = new GameObject [ character.conversationTree.speakers.Length ];
				}

				for ( i = 0; i < character.conversationTree.speakers.Length; i++ ) {
					character.convoSpeakers[i] = EditorGUILayout.ObjectField ( character.conversationTree.speakers[i].id, character.convoSpeakers[i], typeof ( GameObject ), true ) as GameObject;
				}

			}
		
		} else {
			EditorGUILayout.LabelField ( "Conversation trees should only be linked to characters in the scene." );
			character.conversationTree = null;

		}

		if ( GUI.changed ) {
			SavePrefab ( target );
		}
	}
}
