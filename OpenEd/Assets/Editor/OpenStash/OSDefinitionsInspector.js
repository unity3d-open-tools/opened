
#pragma strict

@CustomEditor ( OSDefinitions )
public class OSDefinitionsInspector extends Editor {
	private var resourceWarning : boolean = false;
	
	override function OnInspectorGUI () {
		var definitions : OSDefinitions = target as OSDefinitions;
		
		EditorGUILayout.LabelField ( "Resource", EditorStyles.boldLabel );
		
		EditorGUILayout.BeginHorizontal ();

		EditorGUILayout.TextField ( "Path", definitions.prefabPath );

		if ( !definitions.gameObject.activeInHierarchy ) {
			GUI.backgroundColor = Color.green;
			if ( GUILayout.Button ( "Update", GUILayout.Width ( 60 ) ) ) {
				var path : String = AssetDatabase.GetAssetPath ( definitions.gameObject );
				if ( path.Contains ( "Assets/Resources/" ) ) {
					path = path.Replace ( "Assets/Resources/", "" );
					path = path.Replace ( ".prefab", "" );

					definitions.prefabPath = path;
					
					resourceWarning = false;
				
				} else {
					resourceWarning = true;
				
				}
			}
			GUI.backgroundColor = Color.white;
		}

		EditorGUILayout.EndHorizontal ();

		if ( resourceWarning ) {
			definitions.prefabPath = "";
			GUI.color = Color.red;
			EditorGUILayout.LabelField ( "Object not in /Resources folder!", EditorStyles.boldLabel );
			GUI.color = Color.white;
		}
		
		EditorGUILayout.Space ();

		// Categories
		EditorGUILayout.LabelField ( "Categories", EditorStyles.boldLabel );
		
		var tmpCat : List.< OSCategory >;
		var tmpStr : List.< String >;

		for ( var c : int = 0; c < definitions.categories.Length; c++ ) {
			EditorGUILayout.BeginHorizontal ();
			
			GUI.backgroundColor = Color.red;
			if ( GUILayout.Button ( "x", GUILayout.Width ( 28 ), GUILayout.Height ( 14 ) ) ) {
				tmpCat = new List.< OSCategory > ( definitions.categories );

				tmpCat.RemoveAt ( c );

				definitions.categories = tmpCat.ToArray ();
				return;
			}
			GUI.backgroundColor = Color.white;
			
			definitions.categories[c].id = EditorGUILayout.TextField ( definitions.categories[c].id );
			
			EditorGUILayout.EndHorizontal ();
			
			for ( var sc : int = 0; sc < definitions.categories[c].subcategories.Length; sc++ ) {
				EditorGUILayout.BeginHorizontal ();
				
				GUILayout.Space ( 104 );
				
				GUI.backgroundColor = Color.red;
				if ( GUILayout.Button ( "x", GUILayout.Width ( 28 ), GUILayout.Height ( 14 ) ) ) {
					tmpStr = new List.< String > ( definitions.categories[c].subcategories );

					tmpStr.RemoveAt ( sc );

					definitions.categories[c].subcategories = tmpStr.ToArray ();
					return;
				}
				GUI.backgroundColor = Color.white;
			
				definitions.categories[c].subcategories[sc] = EditorGUILayout.TextField ( definitions.categories[c].subcategories[sc] );
				
				EditorGUILayout.EndHorizontal ();
				
			}
			
			EditorGUILayout.BeginHorizontal ();
			GUILayout.Space ( 104 );
			GUI.backgroundColor = Color.green;
			if ( GUILayout.Button ( "+", GUILayout.Width ( 28 ), GUILayout.Height ( 14 ) ) ) {
				tmpStr = new List.< String > ( definitions.categories[c].subcategories );

				tmpStr.Add ( "Subcategory" );

				definitions.categories[c].subcategories = tmpStr.ToArray ();
				return;
			}
			GUI.backgroundColor = Color.white;
			EditorGUILayout.EndHorizontal ();

			EditorGUILayout.Space ();
		}

		GUI.backgroundColor = Color.green;
		if ( GUILayout.Button ( "+", GUILayout.Width ( 28 ), GUILayout.Height ( 14 ) ) ) {
			tmpCat = new List.< OSCategory > ( definitions.categories );

			tmpCat.Add ( new OSCategory () );

			definitions.categories = tmpCat.ToArray ();
		}
		GUI.backgroundColor = Color.white;
	
		EditorGUILayout.Space ();
		
		// Attributes
		EditorGUILayout.LabelField ( "Attributes", EditorStyles.boldLabel );

		var tmpAttr : List.< OSAttributeDefinition >;

		for ( var a : int = 0; a < definitions.attributes.Length; a++ ) {
			EditorGUILayout.BeginHorizontal ();
			
			GUI.backgroundColor = Color.red;
			if ( GUILayout.Button ( "x", GUILayout.Width ( 28 ), GUILayout.Height ( 14 ) ) ) {
				tmpAttr = new List.< OSAttributeDefinition > ( definitions.attributes );

				tmpAttr.RemoveAt ( a );

				definitions.attributes = tmpAttr.ToArray ();
				return;
			}
			GUI.backgroundColor = Color.white;
			
			EditorGUILayout.BeginVertical ();

			definitions.attributes[a].id = EditorGUILayout.TextField ( "ID", definitions.attributes[a].id );
			definitions.attributes[a].name = EditorGUILayout.TextField ( "Name", definitions.attributes[a].name );
			definitions.attributes[a].suffix = EditorGUILayout.TextField ( "Suffix", definitions.attributes[a].suffix );
			
			EditorGUILayout.EndVertical ();

			EditorGUILayout.EndHorizontal ();

			EditorGUILayout.Space ();
			
		}
		
		GUI.backgroundColor = Color.green;
		if ( GUILayout.Button ( "+", GUILayout.Width ( 28 ), GUILayout.Height ( 14 ) ) ) {
			tmpAttr = new List.< OSAttributeDefinition > ( definitions.attributes );

			tmpAttr.Add ( new OSAttributeDefinition () );

			definitions.attributes = tmpAttr.ToArray ();
		}
		GUI.backgroundColor = Color.white;

		EditorGUILayout.Space ();

		// Ammunitions
		EditorGUILayout.LabelField ( "Ammunitions", EditorStyles.boldLabel );

		var tmpAmmo : List.< OSAmmunition >;

		for ( a = 0; a < definitions.ammunitions.Length; a++ ) {
			EditorGUILayout.BeginHorizontal ();
			
			GUI.backgroundColor = Color.red;
			if ( GUILayout.Button ( "x", GUILayout.Width ( 28 ), GUILayout.Height ( 14 ) ) ) {
				tmpAmmo = new List.< OSAmmunition > ( definitions.ammunitions );

				tmpAmmo.RemoveAt ( a );

				definitions.ammunitions = tmpAmmo.ToArray ();
				return;
			}
			GUI.backgroundColor = Color.white;
			
			EditorGUILayout.BeginVertical ();

			definitions.ammunitions[a].name = EditorGUILayout.TextField ( "Name", definitions.ammunitions[a].name );
			definitions.ammunitions[a].projectile = EditorGUILayout.ObjectField ( "Projectile", definitions.ammunitions[a].projectile, typeof ( OSProjectile ), false ) as OSProjectile;
			
			EditorGUILayout.EndVertical ();

			EditorGUILayout.EndHorizontal ();

			EditorGUILayout.Space ();
			
		}
		
		GUI.backgroundColor = Color.green;
		if ( GUILayout.Button ( "+", GUILayout.Width ( 28 ), GUILayout.Height ( 14 ) ) ) {
			tmpAmmo = new List.< OSAmmunition > ( definitions.ammunitions );

			tmpAmmo.Add ( new OSAmmunition () );

			definitions.ammunitions = tmpAmmo.ToArray ();
		}
		GUI.backgroundColor = Color.white;
		
		// Currencies
		EditorGUILayout.LabelField ( "Currencies", EditorStyles.boldLabel );

		var tmpCurrency : List.< OSCurrency >;

		for ( a = 0; a < definitions.currencies.Length; a++ ) {
			EditorGUILayout.BeginHorizontal ();
			
			GUI.backgroundColor = Color.red;
			if ( GUILayout.Button ( "x", GUILayout.Width ( 28 ), GUILayout.Height ( 14 ) ) ) {
				tmpCurrency = new List.< OSCurrency > ( definitions.currencies );

				tmpCurrency.RemoveAt ( a );

				definitions.currencies = tmpCurrency.ToArray ();
				return;
			}
			GUI.backgroundColor = Color.white;
			
			EditorGUILayout.BeginVertical ();

			definitions.currencies[a].name = EditorGUILayout.TextField ( "Name", definitions.currencies[a].name );
			
			EditorGUILayout.EndVertical ();

			EditorGUILayout.EndHorizontal ();

			EditorGUILayout.Space ();
			
		}
		
		GUI.backgroundColor = Color.green;
		if ( GUILayout.Button ( "+", GUILayout.Width ( 28 ), GUILayout.Height ( 14 ) ) ) {
			tmpCurrency = new List.< OSCurrency > ( definitions.currencies );

			tmpCurrency.Add ( new OSCurrency () );

			definitions.currencies = tmpCurrency.ToArray ();
		}
		GUI.backgroundColor = Color.white;

		if ( GUI.changed ) {
			OSInventoryInspector.SavePrefab ( target );
		}
	}
}
		
