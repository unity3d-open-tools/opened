#pragma strict

@CustomEditor ( OEWorkspace )
public class OEWorkspaceInspector extends Editor {
	override function OnInspectorGUI () {
		var workspace : OEWorkspace = target as OEWorkspace;

		DrawDefaultInspector ();

		EditorGUILayout.Space ();
		
		EditorGUILayout.LabelField ( "Preferred parents", EditorStyles.boldLabel );

		for ( var i : int = 0; i < workspace.preferredParents.Length; i++ ) {
			EditorGUILayout.BeginHorizontal ();
			
			var typeIndex : int = 0;
			var typeStrings : String[] = OFField.GetTypeStrings ();

			for ( var t : int = 0; t < typeStrings.Length; t++ ) {
				if ( workspace.preferredParents[i].typeName == typeStrings[t] ) {
					typeIndex = t;
				}
			}
			
			workspace.preferredParents[i].typeName = typeStrings [ EditorGUILayout.Popup ( typeIndex, OFField.GetTypeStrings () ) ];
			workspace.preferredParents[i].parent = EditorGUILayout.ObjectField ( workspace.preferredParents[i].parent, typeof ( Transform ), true ) as Transform;
			
			GUI.backgroundColor = Color.red;
			if ( GUILayout.Button ( "x", GUILayout.Width ( 28 ), GUILayout.Height ( 14 ) ) ) {
				var tmp : List.< OEWorkspace.PreferredParent > = new List.< OEWorkspace.PreferredParent > ( workspace.preferredParents );
				
				tmp.RemoveAt ( i );

				workspace.preferredParents = tmp.ToArray ();
			}
			GUI.backgroundColor = Color.white;
			
			EditorGUILayout.EndHorizontal ();
		}
		
		GUI.backgroundColor = Color.green;
		if ( GUILayout.Button ( "+", GUILayout.Width ( 28 ), GUILayout.Height ( 14 ) ) ) {
			tmp = new List.< OEWorkspace.PreferredParent > ( workspace.preferredParents );
			
			tmp.Add ( new OEWorkspace.PreferredParent () );

			workspace.preferredParents = tmp.ToArray ();
		}
		GUI.backgroundColor = Color.white;

	}
}
