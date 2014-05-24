#pragma strict

@CustomEditor ( OSInventory )
public class OSInventoryInspector extends Editor {
	private var selected : OSSlot;

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

	override function OnInspectorGUI () {
		var inventory : OSInventory = target as OSInventory;
		inventory.definitions = EditorGUILayout.ObjectField ( "Definitions", inventory.definitions, typeof ( OSDefinitions ), false ) as OSDefinitions;
		
		if ( !inventory.definitions ) {
			GUI.color = Color.red;
			EditorGUILayout.LabelField ( "You need to link an OSDefinitions prefab with this inventory", EditorStyles.boldLabel );
			GUI.color = Color.white;
			return;
		}
		
		EditorGUILayout.Space ();
		
		EditorGUILayout.LabelField ( "Currency amounts", EditorStyles.boldLabel );

		for ( var i : int = 0; i < inventory.definitions.currencies.Length; i++ ) {
			var def : OSCurrency = inventory.definitions.currencies[i];
			
			EditorGUILayout.BeginHorizontal ();

			inventory.CheckCurrency ( i );

			var oldAmount : int = inventory.GetCurrencyAmount ( def.name );
			var newAmount : int = EditorGUILayout.IntField ( def.name, oldAmount );
		
			if ( oldAmount != newAmount ) {
				inventory.SetCurrencyAmount ( def.name, newAmount );
			}			

			EditorGUILayout.EndHorizontal ();
		}
		
		EditorGUILayout.Space ();

		var event : Event = Event.current;

		inventory.grid.inventory = inventory;

		// Grid
		var slot : OSSlot;
		var slotSize : int = 60;
		var mouseDown : boolean = event.type == EventType.MouseDown;
		var mouseUp : boolean = event.type == EventType.MouseUp;
		var keyLeft : boolean = event.type == EventType.KeyDown && event.keyCode == KeyCode.LeftArrow;
		var keyRight : boolean = event.type == EventType.KeyDown && event.keyCode == KeyCode.RightArrow;
		var keyUp : boolean = event.type == EventType.KeyDown && event.keyCode == KeyCode.UpArrow;
		var keyDown : boolean = event.type == EventType.KeyDown && event.keyCode == KeyCode.DownArrow;
		var keyTab : boolean = event.type == EventType.KeyDown && event.keyCode == KeyCode.Tab;
		var keyBackspace : boolean = event.type == EventType.KeyDown && event.keyCode == KeyCode.Backspace;

		EditorGUILayout.BeginHorizontal ();
		
		GUILayout.Space ( 34 );
		inventory.grid.width = EditorGUILayout.IntField ( inventory.grid.width, GUILayout.Width ( 30 ) );

		EditorGUILayout.EndHorizontal ();
		
		GUILayout.Space ( 4 );
		
		EditorGUILayout.BeginHorizontal ();
	
		inventory.grid.height = EditorGUILayout.IntField ( inventory.grid.height, GUILayout.Width ( 30 ) );
	
		var rect : Rect = EditorGUILayout.GetControlRect ( GUILayout.Width ( slotSize * inventory.grid.width ), GUILayout.Height ( slotSize * inventory.grid.height ) );	
		var xPos : int = rect.x;
		var yPos : int = rect.y;
		var skip : boolean [ , ] = inventory.grid.GetSkippedSlots();
	
		if ( mouseDown && !rect.Contains ( event.mousePosition ) ) {
			selected = null;
		}


		for ( var x : int = 0; x < inventory.grid.width; x++ ) {
			for ( var y : int = 0; y < inventory.grid.height; y++ ) {
				if ( skip [ x, y ] == true ) {
					continue;
				
				} else {
					var tex : Texture2D = null;
					var item : OSItem;
					var slotRect : Rect; 
					slot = inventory.GetSlot ( x, y ); 
					
					xPos = rect.x + x * slotSize;
					yPos = rect.y + y * slotSize;

					if ( slot && slot.item && !slot.hidden ) {
						item = slot.item;
						tex = item.preview;
						slotRect = new Rect ( xPos, yPos, slotSize * slot.scale.x, slotSize * slot.scale.y );

						if ( slot == selected ) {
							GUI.backgroundColor = Color.green;
							GUI.SetNextControlName ( "Selected" );

						}

						GUI.Box ( slotRect, "" );
						GUI.backgroundColor = Color.white;
						
						if ( tex ) {
							GUI.DrawTexture ( slotRect, tex );
						}
						
						if ( slot.quantity > 1 ) {
							GUI.Label ( new Rect ( xPos + 4, yPos + slot.scale.y * slotSize - 20, slot.scale.x * slotSize, 20 ), slot.quantity.ToString() );
						}
						
						if ( slotRect.Contains ( event.mousePosition ) && mouseDown ) {
							selected = slot;
						}

					} else {
						slotRect = new Rect ( xPos, yPos, slotSize, slotSize );
						
						if ( slotRect.Contains ( event.mousePosition ) && mouseDown ) {
							selected = null;
						}
						
						GUI.Box ( slotRect, "" );
					}

				}
				
			}

		}

		EditorGUILayout.BeginVertical ();	
		
		if ( selected && selected.item ) {
			EditorGUILayout.LabelField ( selected.item.id, EditorStyles.boldLabel );
			EditorGUILayout.LabelField ( selected.item.description );

			EditorGUILayout.Space ();

			for ( var attribute : OSAttribute in selected.item.attributes ) {
				EditorGUILayout.BeginHorizontal ();
				
				EditorGUILayout.LabelField ( attribute.name + ":", GUILayout.Width ( 80 ) );
				EditorGUILayout.LabelField ( attribute.value + " " + attribute.suffix, GUILayout.Width ( 80 ) );
				
				EditorGUILayout.EndHorizontal ();
			}
			
			EditorGUILayout.Space ();
			
			EditorGUILayout.LabelField ( "[ " + selected.item.category + " : " + selected.item.subcategory + " ]" );
		}
		
		EditorGUILayout.EndVertical ();

		EditorGUILayout.EndHorizontal ();

		EditorGUILayout.Space ();

		var addItem : OSItem;
		addItem = EditorGUILayout.ObjectField ( "Add item", addItem, OSItem, true ) as OSItem;

		if ( addItem ) {
			inventory.AddItem ( addItem );
		}

		GUI.backgroundColor = Color.red;
		if ( GUILayout.Button ( "Clear inventory" ) ) {
			inventory.slots.Clear ();
		}
		GUI.backgroundColor = Color.white;

		// ^ Move slot
		if ( selected && selected.item ) {
			if ( keyLeft ) {
				inventory.grid.Move ( selected, selected.x - 1, selected.y );
				event.Use ();
			
			} else if ( keyRight ) {
				inventory.grid.Move ( selected, selected.x + 1, selected.y );
				event.Use ();


			} else if ( keyDown ) {
				inventory.grid.Move ( selected, selected.x, selected.y + 1 );
				event.Use ();

			
			} else if ( keyUp ) {
				inventory.grid.Move ( selected, selected.x, selected.y - 1 );
				event.Use ();

			} else if ( keyBackspace ) {
				inventory.RemoveItem ( selected.item );
				event.Use ();
			
			}

		}
		
		if ( keyTab ) {
			event.Use ();
			
			if ( selected && selected.item ) {
				i = inventory.GetItemIndex ( selected.item );

				if ( i < inventory.slots.Count - 1 ) {
					i++;
				} else {
					i = 0;
				}

				selected = inventory.slots[i];

			} else if ( inventory.slots.Count > 0 ) {
				selected = inventory.slots[0];

			}
			
			GUI.FocusControl ( "Selected" );


		}

		Repaint ();
		
		if ( GUI.changed ) {
			SavePrefab ( target );
		}
	}
}
