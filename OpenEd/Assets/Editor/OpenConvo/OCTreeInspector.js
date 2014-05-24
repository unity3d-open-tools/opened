#pragma strict

import System.Collections.Generic;

@CustomEditor ( OCTree )
public class OCTreeInspector extends Editor {
	private class NodeConnection {
		public var container : NodeContainer;
		public var output : int;
		
		function NodeConnection ( container : NodeContainer, output : int ) {
			this.container = container;
			this.output = output;
		}	
	}

	private class NodeContainer {
		public var node : OCNode;
		public var inputRect : Rect;
		public var outputRects : Rect[] = new Rect[0];
		public var outputs : NodeContainer[] = new NodeContainer[0];
		public var rect : Rect;
		public var dirty : boolean = false;
		public var orphan : boolean = false;

		function NodeContainer ( node : OCNode ) {
			this.node = node;
		}

		public function SetOutputAmount ( n : int ) {
			outputs = new NodeContainer[n];
			outputRects = new Rect[n];
		}
	}

	private var editRoot : int = 0;
	private var scrollPos : Vector2;
	private var nodeContainers : Dictionary.< int, NodeContainer > = new Dictionary.< int, NodeContainer > ();
	private var offset : Dictionary.< float, float > = new Dictionary.< float, float > ();
	private var connecting : NodeConnection;
	private var nodeDistance : float = 200;
	private var viewRect : Rect;

	public static function SavePrefab ( target : UnityEngine.Object ) {
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

    	private function DrawBezierCurve ( start : Vector2, end : Vector2 ) {
		var startPos : Vector3 = new Vector3(start.x, start.y, 0);
		var endPos : Vector3 = new Vector3(end.x, end.y, 0);
		var startTan : Vector3 = startPos + Vector3.up * 50;
		var endTan : Vector3 = endPos - Vector3.up * 50;

		Handles.color = Color.green;
		Handles.DrawBezier(startPos, endPos, startTan, endTan, new Color ( 1, 1, 1, 0.5 ), null, 1);
    		Handles.color = Color.white;
	}
	
	private function GetSpeakerStrings ( tree : OCTree ) : String[] {
		var result : String[] = new String [ tree.speakers.Length ];

		for ( var i : int = 0; i < result.Length; i++ ) {
			result[i] = tree.speakers[i].id;
		}

		return result;
	}

	override function OnInspectorGUI () {
		var tree : OCTree = target as OCTree;

		if ( tree.gameObject.activeInHierarchy ) {
			GUI.color = Color.red;
			EditorGUILayout.LabelField ( "OCTree objects should be stored as prefabs, not scene objects!", EditorStyles.boldLabel );
			GUI.color = Color.white;
			EditorGUILayout.Space ();
		}

		var rootNodeStrings : String[] = new String[tree.rootNodes.Length];
		for ( var i : int = 0; i < rootNodeStrings.Length; i++ ) {
			rootNodeStrings[i] = i.ToString();
		}
		
		EditorGUILayout.LabelField ( "Speakers", EditorStyles.boldLabel );

		for ( i = 0; i < tree.speakers.Length; i++ ) {
			EditorGUILayout.BeginHorizontal ();
			tree.speakers[i].id = EditorGUILayout.TextField ( i.ToString(), tree.speakers[i].id );
			
			GUI.backgroundColor = Color.red;
			if ( GUILayout.Button ( "x", GUILayout.Width ( 28 ), GUILayout.Height ( 14 ) ) ) {
				tree.RemoveSpeaker ( i );
			}
			GUI.backgroundColor = Color.white;
			
			EditorGUILayout.EndHorizontal ();
		}
		
		GUI.backgroundColor = Color.green;
		if ( GUILayout.Button ( "+", GUILayout.Width ( 28 ), GUILayout.Height ( 14 ) ) ) {
			tree.AddSpeaker ();
		}
		GUI.backgroundColor = Color.white;

		EditorGUILayout.Space ();

		offset.Clear ();
		
		var lblStyle : GUIStyle = new GUIStyle ( GUI.skin.label );
		lblStyle.alignment = TextAnchor.MiddleCenter;
		lblStyle.padding.left = 0;
		
		// Select root
		EditorGUILayout.BeginHorizontal ();
		
		EditorGUILayout.LabelField ( "Root", EditorStyles.boldLabel, GUILayout.Width ( 80 ) );
		
		EditorGUILayout.BeginVertical ();
		
		EditorGUILayout.BeginHorizontal ();
		
		var newEditRoot : int = EditorGUILayout.Popup ( editRoot, rootNodeStrings, GUILayout.Width ( 200 ) );
		
		if ( newEditRoot != editRoot ) {
			editRoot = newEditRoot;
			nodeContainers.Clear();
		}

		GUI.backgroundColor = Color.red;
		if ( GUILayout.Button ( "x", GUILayout.Width ( 28 ), GUILayout.Height ( 14 ) ) ) {
			tree.RemoveRootNode ( editRoot );
			editRoot = 0;
			nodeContainers.Clear();
		}
		GUI.backgroundColor = Color.white;
		
		EditorGUILayout.EndHorizontal ();

		GUI.backgroundColor = Color.green;
		if ( GUILayout.Button ( "+", GUILayout.Width ( 28 ), GUILayout.Height ( 14 ) ) ) {
			tree.AddRootNode ();
			editRoot = tree.rootNodes.Length - 1;
			nodeContainers.Clear();
		}
		GUI.backgroundColor = Color.white;
		
		EditorGUILayout.EndVertical ();
	
		if ( tree.rootNodes[editRoot] == null ) {
			tree.rootNodes[editRoot] = new OCRootNode ();
		}
		var root : OCRootNode = tree.rootNodes[editRoot];	

		EditorGUILayout.EndHorizontal ();
	
		EditorGUILayout.Space ();

		// Set tags
		EditorGUILayout.BeginHorizontal ();
		
		EditorGUILayout.LabelField ( "Tags", EditorStyles.boldLabel, GUILayout.Width ( 80 ) );
		
		EditorGUILayout.BeginVertical ();
		
		for ( i = 0; i < root.tags.Length; i++ ) {
			EditorGUILayout.BeginHorizontal ();
			root.tags[i] = EditorGUILayout.TextField ( root.tags[i], GUILayout.Width ( 200 ) );
			GUI.backgroundColor = Color.red;
			if ( GUILayout.Button ( "x", GUILayout.Width ( 28 ), GUILayout.Height ( 14 ) ) ) {
				root.RemoveTag ( root.tags[i] );
			}
			GUI.backgroundColor = Color.white;
			EditorGUILayout.EndHorizontal ();
		}
		
		GUI.backgroundColor = Color.green;
		if ( GUILayout.Button ( "+", GUILayout.Width ( 28 ), GUILayout.Height ( 14 ) ) ) {
			root.SetTag ( "newTag" );
		}
		GUI.backgroundColor = Color.white;
		
		EditorGUILayout.EndVertical ();

		EditorGUILayout.EndHorizontal ();
		
		EditorGUILayout.Space ();

		// Nodes
		EditorGUILayout.BeginHorizontal ();
		EditorGUILayout.LabelField ( "Nodes", EditorStyles.boldLabel, GUILayout.Width ( 80 ) );
		GUI.backgroundColor = Color.red;
		if ( GUILayout.Button ( "Clear", GUILayout.Width ( 100 ) ) ) {
			root.ClearNodes ();
			nodeContainers.Clear ();
		}
		GUI.backgroundColor = Color.white;

		EditorGUILayout.EndHorizontal ();

		EditorGUILayout.Space ();

		GUI.color = new Color ( 0, 0, 0, 0 );
		GUILayout.Box ( "", GUILayout.Height ( 400 ) );
		GUI.color = Color.white;

		var scrollRect : Rect = GUILayoutUtility.GetLastRect ();
		scrollRect.width = Screen.width - 40;

		if ( viewRect.xMax < scrollRect.xMax - 40 ) {
			viewRect.xMax = scrollRect.xMax - 40;
		}

		scrollPos = GUI.BeginScrollView ( scrollRect, scrollPos, viewRect );

		if ( root.nodes.Length < 1 ) {
			GUI.backgroundColor = Color.green;
			if ( GUI.Button ( new Rect ( 0, 0, 20, 16 ), "+" ) ) {
				root.AddFirstNode ();
			}
			viewRect.xMax = 100;
			viewRect.yMax = 80;
			GUI.backgroundColor = Color.white;

		} else {	
			for ( i = 0; i < root.nodes.Length; i++ ) {
				var node : OCNode = root.nodes[i];
				if ( node == null ) { continue; }

				if ( !nodeContainers.ContainsKey ( node.id ) ) {
					nodeContainers[node.id] = new NodeContainer ( node );

				} else {
					// Set container data
					var container : NodeContainer = nodeContainers[node.id];
					container.node = node;
					
					container.inputRect = new Rect ( container.rect.x - 7, container.rect.y - 7, 14, 14 );
					container.dirty = true;

					// Set view rect
					viewRect.xMin = -20;
					viewRect.yMin = -20;
				
					if ( viewRect.xMax < container.rect.xMax ) {
						viewRect.xMax = container.rect.xMax + 20;
					}
					
					if ( viewRect.yMax < container.rect.yMax ) {
						viewRect.yMax = container.rect.yMax + 120;
					}

					// Draw container						
					GUI.Box ( container.rect, "" );
				
					// ^ Remove button
					GUI.backgroundColor = Color.red;
					if ( GUI.Button ( new Rect ( container.rect.xMax - 27, container.rect.y - 1, 28, 14 ), "x" ) ) {
						for ( var c : int = 0; c < container.outputs.Length; c++ ) {
							if ( container.outputs[c] ) {
								container.outputs[c].orphan = true;
							}
						}
						
						nodeContainers.Remove(node.id);
						root.RemoveNode ( node.id );
					}
					GUI.backgroundColor = Color.white;

					// ^ Input
					if ( container.node.id != root.firstNode ) {
						if ( GUI.Button ( container.inputRect, "" ) ) {
							if ( connecting && connecting.container && connecting.container.node.id != node.id ) {
								connecting.container.node.connectedTo[connecting.output] = node.id;
								container.orphan = false;
								connecting = null;
							}
						}
					
						// Orphan
						if ( container.rect.x == 0 && container.rect.y == 0 ) {
							container.orphan = true;
						}
					}
					
					if ( container.orphan ) {
						container.rect.x = 400;
						container.rect.y = scrollPos.y + 20;

						GUI.Label ( new Rect ( container.rect.x + 140, container.rect.y - 10, 100, 16 ), "orphan" );
					}


					// ^ Type
					var nodeTypeStrings : String[] = System.Enum.GetNames ( typeof ( OCNodeType ) );
					var typeIndex : int = node.type;
					var newTypeIndex : int = 0;
					var typeRect : Rect = new Rect ( container.rect.x + 20, container.rect.y - 7, 100, 16 );

					newTypeIndex = EditorGUI.Popup ( typeRect, typeIndex, nodeTypeStrings );

					if ( newTypeIndex != typeIndex ) {
						node.SetType ( newTypeIndex );
					}

					// ^ Begin clipping
					GUI.BeginGroup ( container.rect );

					// Draw nodes
					switch ( node.type ) {
						case OCNodeType.Speak:
							if ( !node.speak ) { break; }

							var lineWidth : float = 180;
							
							container.rect.width = 50 + node.speak.lines.length * 190;
							container.rect.height = 80;

							EditorGUI.LabelField ( new Rect ( 10, 20, 60, 16 ), "Speaker" );
							node.speak.speaker = EditorGUI.Popup ( new Rect ( 70, 20, 120, 16 ), node.speak.speaker, GetSpeakerStrings ( tree ) );
					
							node.SetOutputAmount ( node.speak.lines.Length );
							container.SetOutputAmount ( node.connectedTo.Length );

							for ( var l : int = 0; l < node.speak.lines.Length; l++ ) {
								var lineRect : Rect = new Rect ( 10 + l * ( lineWidth + 10 ), 40, lineWidth, 16 );
								node.speak.lines[l] = EditorGUI.TextField ( lineRect, node.speak.lines[l] );

								if ( l > 0 ) {
									GUI.backgroundColor = Color.red;
									if ( GUI.Button ( new Rect ( lineRect.xMax - 28, 62, 28, 14 ), "x" ) ) {
										if ( nodeContainers.ContainsKey ( node.connectedTo[l] ) ) {
											nodeContainers [ node.connectedTo[l] ].orphan = true;
										}
										
										var tmpLines : List.<String> = new List.<String>(node.speak.lines);
										tmpLines.RemoveAt ( l );
										node.speak.lines = tmpLines.ToArray ();
									}
									GUI.backgroundColor = Color.white;
								}
								
								container.outputRects[l] = new Rect ( container.rect.xMin + lineRect.xMin, container.rect.yMax - 7, 14, 14 );
							}
									
							GUI.backgroundColor = Color.green;
							if ( GUI.Button ( new Rect ( 10 + node.speak.lines.Length * ( lineWidth + 10 ), 42, 28, 14 ), "+" ) ) {
								tmpLines = new List.<String>(node.speak.lines);
								tmpLines.Add ( "" );
								node.speak.lines = tmpLines.ToArray ();
							}
							GUI.backgroundColor = Color.white;
							break;

						case OCNodeType.Event:
							if ( !node.event ) { break; }
							
							container.rect.width = 200;

							if ( node.event.object == null ) {
								container.rect.height = 110;
							} else {
								container.rect.height = 80;
							}

							EditorGUI.LabelField ( new Rect ( 10, 20, 80, 16 ), "Message" );
							node.event.message = EditorGUI.TextField ( new Rect ( 80, 20, 110, 16 ), node.event.message );
							
							EditorGUI.LabelField ( new Rect ( 10, 50, 80, 16 ), "Object" );
							node.event.object = EditorGUI.ObjectField ( new Rect ( 80, 50, 110, 16 ), node.event.object, typeof(GameObject), true ) as GameObject;
							
							if ( node.event.object == null ) {
								EditorGUI.LabelField ( new Rect ( 10, 80, 80, 16 ), "Argument" );
								node.event.argument = EditorGUI.TextField ( new Rect ( 80, 80, 110, 16 ), node.event.argument );
							} else {
								node.event.argument = "";
							}

							container.SetOutputAmount ( node.connectedTo.Length );
							container.outputRects[0] = new Rect ( container.rect.xMin + 10, container.rect.yMax - 7, 14, 14 );
							break;

						case OCNodeType.Jump:
							if ( !node.jump ) { break; }
							
							container.rect.width = 200;
							container.rect.height = 40;
							
							EditorGUI.LabelField ( new Rect ( 10, 20, 80, 16 ), "To root" );
							node.jump.rootNode = EditorGUI.Popup ( new Rect ( 80, 20, 110, 16 ), node.jump.rootNode, rootNodeStrings );
							
							container.SetOutputAmount ( 0 );
							break;

						case OCNodeType.SetFlag:
							if ( !node.setFlag ) { break; }
							
							container.rect.width = 200;
							container.rect.height = 80;

							EditorGUI.LabelField ( new Rect ( 10, 20, 80, 16 ), "Flag" );
							node.setFlag.flag = EditorGUI.TextField ( new Rect ( 80, 20, 110, 16 ), node.setFlag.flag );
							EditorGUI.LabelField ( new Rect ( 10, 50, 80, 16 ), "Bool" );
							node.setFlag.b = EditorGUI.Toggle ( new Rect ( 80, 50, 110, 16 ), node.setFlag.b );
							
							container.SetOutputAmount ( node.connectedTo.Length );
							container.outputRects[0] = new Rect ( container.rect.xMin + 10, container.rect.yMax - 7, 14, 14 );
							break;

						case OCNodeType.GetFlag:
							if ( !node.getFlag ) { break; }
							
							container.rect.width = 200;
							container.rect.height = 80;

							EditorGUI.LabelField ( new Rect ( 10, 20, 80, 16 ), "Flag" );
							node.getFlag.flag = EditorGUI.TextField ( new Rect ( 80, 20, 110, 16 ), node.getFlag.flag );
							
							EditorGUI.LabelField ( new Rect ( 10, 50, 80, 16 ), "False" );
							EditorGUI.LabelField ( new Rect ( 200 - 40, 50, 80, 16 ), "True" );

							container.SetOutputAmount ( node.connectedTo.Length );
							container.outputRects[0] = new Rect ( container.rect.xMin + 10, container.rect.yMax - 7, 14, 14 );
							container.outputRects[1] = new Rect ( container.rect.xMax - 24, container.rect.yMax - 7, 14, 14 );
							break;

						case OCNodeType.End:
							if ( !node.end ) { break; }
							
							container.rect.width = 200;
							container.rect.height = 40;
							
							EditorGUI.LabelField ( new Rect ( 10, 20, 80, 16 ), "Next root" );
							node.end.rootNode = EditorGUI.Popup ( new Rect ( 80, 20, 110, 16 ), node.end.rootNode, rootNodeStrings );
							
							container.SetOutputAmount ( 0 );
							break;

						default:
							container.rect.width = 200;
							container.rect.height = 50;

							container.SetOutputAmount ( 0 );
							EditorGUI.LabelField ( new Rect ( 10, 20, 180, 16 ), "Invalid node" );
							break;
					}
					
					GUI.EndGroup ();

					// ^ Output
					for ( var o : int = 0; o < container.outputRects.Length; o++ ) {
						if ( GUI.Button ( container.outputRects[o], "" ) ) {
							if ( nodeContainers.ContainsKey ( node.connectedTo[o] ) ) {
								nodeContainers[node.connectedTo[o]].orphan = true;
							}

							node.connectedTo[o] = 0;
							connecting = new NodeConnection ( container, o );
						}
						GUI.Label ( container.outputRects[o], o.ToString (), lblStyle );

						var cNode : OCNode = root.GetNode(node.connectedTo[o]);

						if ( cNode ) {
							var cContainer : NodeContainer;
							
							if ( nodeContainers.ContainsKey ( cNode.id ) ) {
								cContainer = nodeContainers[cNode.id];
							}

							if ( cContainer ) {
								cContainer.orphan = false;
								
								if ( cContainer.dirty ) {
									var minimum : float = container.outputRects[o].x - 10;

									if ( !offset.ContainsKey(cContainer.rect.y) ) {
										offset[cContainer.rect.y] = 0;
									}
									
									if ( offset[cContainer.rect.y] > minimum ) {
										minimum = offset[cContainer.rect.y];
									}
									
									cContainer.rect.x = minimum;
									cContainer.rect.y = container.rect.y + nodeDistance;
									offset[cContainer.rect.y] = cContainer.rect.xMax + 20;
								
									cContainer.dirty = false;
								}

								DrawBezierCurve ( container.outputRects[o].center, new Vector2 ( cContainer.rect.x, cContainer.rect.y ) );
							}

						} else {
							var newRect : Rect = container.outputRects[o];
							newRect.y += 20;

							GUI.backgroundColor = Color.green;
							if ( GUI.Button ( newRect, "" ) ) {
								var newNode : OCNode = root.AddNode ();
								node.connectedTo[o] = newNode.id;
							}
							GUI.Label ( newRect, "+", lblStyle );
							GUI.backgroundColor = Color.white;
						}
					}
				}
			}

		}
		
		// Draw connection bezier
		if ( connecting && connecting.container && connecting.container.node ) {
			if ( connecting.output < connecting.container.outputRects.Length ) {
				DrawBezierCurve ( connecting.container.outputRects[connecting.output].center, Event.current.mousePosition );
			}
		}
	
		if ( Event.current.type == EventType.MouseDown ) {
			connecting = null;
		}

		GUI.EndScrollView ();
	
		Repaint ();

		if ( GUI.changed ) {
			SavePrefab ( target );
		}
	}
}
