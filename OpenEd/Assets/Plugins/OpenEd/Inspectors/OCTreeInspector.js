#pragma strict

public class OCTreeInspector extends OEComponentInspector {
	override function get type () : System.Type { return typeof ( OCTree ); }

	private var tree : OCTree;
	private var currentRootNode : int = 0;

	private function DrawNode ( node : OCNode, x : float, y : float ) {
		var nodeTypeStrings : String[] = System.Enum.GetNames ( typeof ( OCNodeType ) );
		var typeIndex : int = node.type;
		var newTypeIndex : int = 0;
		
		newTypeIndex = Popup ( "", typeIndex, nodeTypeStrings, new Rect ( x, y - 8, 100, 16 ) );

		if ( newTypeIndex != typeIndex ) {
			node.type = newTypeIndex;
			
			switch ( node.type ) {
				case OCNodeType.Speak:
					if ( !node.speak ) { node.speak = new OCSpeak (); }
					break;
			}
		}

		switch ( node.type ) {
			case OCNodeType.Speak:	
				for ( var l : int = 0; l < node.speak.lines.Length; l++ ) {
					node.speak.lines[l] = TextField ( "", node.speak.lines[l], new Rect ( x + l * 260, y + 20, 220, 16 ) );
					
					if ( l > 0 ) {
						if ( Button ( "x", new Rect ( x + ( l + 1 ) * 260 - 30, y + 20, 24, 16 ) ) ) {
							var tmpLines : List.< String > = new List. < String > ( node.speak.lines );
							tmpLines.RemoveAt ( l );
							node.speak.lines = tmpLines.ToArray ();
						}
					}
				}
				
				if ( Button ( "+", new Rect ( x + node.speak.lines.Length * 260, y + 20, 24, 16 ) ) ) {
					tmpLines = new List.< String > ( node.speak.lines );
					tmpLines.Add ( "" );
					node.speak.lines = tmpLines.ToArray ();
				}
				
				break;
		}
		
		for ( var c : int = 0; c < node.connectedTo.Length; c++ ) {
			var nx : float = x + c * 260;
			var ny : float = y + 100;
			
			DrawNode ( tree.rootNodes[currentRootNode].GetNode ( node.connectedTo[c] ), nx, ny );
		}
	}

	override function Inspector () {
		tree = target.GetComponent.< OCTree >();
	
		var rootNodeStrings : String[] = new String[tree.rootNodes.Length];
		for ( var i : int = 0; i < rootNodeStrings.Length; i++ ) {
			rootNodeStrings[i] = i.ToString();
		}
		
		for ( i = 0; i < tree.speakers.Length; i++ ) {
			tree.speakers[i].id = TextField ( i.ToString(), tree.speakers[i].id, new Rect ( 0, i * 20, 200, 16 ) );
			
			if ( Button ( "x", new Rect ( 210, i * 20, 24, 16 ) ) ) {
				tree.RemoveSpeaker ( i );
			}

		}

		if ( Button ( "+", new Rect ( 0, tree.speakers.Length * 20, 24, 16 ) ) ) {
			tree.AddSpeaker ();
		}
		
		DrawNode ( tree.rootNodes[0].nodes[0], 10, 100 );
	}
}
