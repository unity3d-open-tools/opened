#pragma strict

@CustomEditor ( OFSerializedObject )
public class OFSerializedObjectInspector extends Editor {
	private var resourceWarning : boolean = false;
	
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
		var obj : OFSerializedObject = target as OFSerializedObject;
		var inScene : boolean = obj.gameObject.activeInHierarchy;

		if ( !inScene ) {
			GUI.color = new Color ( 1, 1, 1, 0.5 );
		}
		
		// Instance
		EditorGUILayout.LabelField ( "Instance", EditorStyles.boldLabel );
		
		EditorGUILayout.BeginHorizontal ();

		EditorGUILayout.TextField ( "ID", obj.id );

		if ( inScene ) {
			GUI.backgroundColor = Color.green;
			if ( GUILayout.Button ( "Update", GUILayout.Width ( 60 ) ) ) {
				obj.RenewId();
			}
			GUI.backgroundColor = Color.white;
		}

		EditorGUILayout.EndHorizontal ();

		GUI.color = new Color ( 1, 1, 1, 1 );

		if ( !inScene ) {
			obj.id = "";
		
		} else {
			GUI.color = new Color ( 1, 1, 1, 0.5 );
		
		}

		// Resource
		EditorGUILayout.Space ();
		EditorGUILayout.LabelField ( "Resource", EditorStyles.boldLabel );
		
		EditorGUILayout.BeginHorizontal ();

		EditorGUILayout.TextField ( "Path", obj.prefabPath );

		var item : OSItem = obj.GetComponent.< OSItem > ();

		if ( !inScene && !item ) {
			GUI.backgroundColor = Color.green;
			if ( GUILayout.Button ( "Update", GUILayout.Width ( 60 ) ) ) {
				var path : String = AssetDatabase.GetAssetPath ( obj.gameObject );
				if ( path.Contains ( "Assets/Resources/" ) ) {
					path = path.Replace ( "Assets/Resources/", "" );
					path = path.Replace ( ".prefab", "" );

					obj.prefabPath = path;
					
					resourceWarning = false;
				
				} else {
					resourceWarning = true;
				
				}
			}
			GUI.backgroundColor = Color.white;
		
		} else if ( item ) {
			obj.prefabPath = item.prefabPath;

		}	

		EditorGUILayout.EndHorizontal ();

		if ( resourceWarning ) {
			obj.prefabPath = "";
			GUI.color = Color.red;
			EditorGUILayout.LabelField ( "Object not in /Resources folder!", EditorStyles.boldLabel );
			GUI.color = Color.white;
		}
		
		EditorGUILayout.Space ();
		
		GUI.color = new Color ( 1, 1, 1, 1 );

		EditorGUILayout.LabelField ( "Components", EditorStyles.boldLabel );
		var allComponents : Component[] = obj.gameObject.GetComponents.<Component>();

		for ( var i : int = 0; i < allComponents.Length; i++ ) {
			if ( !allComponents[i] ) { continue; }

			var name : String = allComponents[i].GetType().ToString();
			name = name.Replace ( "UnityEngine.", "" );

			if ( allComponents[i].GetType() == OFSerializedObject ) {
				continue;
			}

			if ( OFSerializer.CanSerialize ( allComponents[i].GetType() ) ) {
				var hasField : boolean = obj.HasField ( name );
				
				hasField = EditorGUILayout.Toggle ( name, hasField );
		
				if ( hasField ) {
					obj.SetField ( name, allComponents[i] );
				
				} else {
					obj.RemoveField ( name );

				}

			} else {
				GUI.color = new Color ( 1, 1, 1, 0.5 );
				EditorGUILayout.LabelField ( name );
				GUI.color = Color.white;
			
			}
			
		}

		EditorGUILayout.Space ();

		EditorGUILayout.LabelField ( "File operations", EditorStyles.boldLabel );

		EditorGUILayout.BeginHorizontal ();

		obj.exportPath = EditorGUILayout.TextField ( obj.exportPath );

		if ( GUILayout.Button ( "Export" ) ) {
			OFWriter.SaveFile ( OFSerializer.Serialize ( obj ), Application.dataPath + "/" + obj.exportPath + "/" + obj.name + ".json" );
		}
		
		EditorGUILayout.EndHorizontal ();

		if ( GUI.changed ) {
			SavePrefab ( target );
		}
	}
}
