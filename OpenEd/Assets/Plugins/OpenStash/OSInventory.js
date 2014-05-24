#pragma strict

import System.Collections.Generic;

public class OSCurrencyAmount {
	public var index : int = 0;
	public var amount : int = 0;

	function OSCurrencyAmount ( index : int ) {
		this.index = index;
	}
}

public class OSGrid {
	public var width : int = 1;
	public var height : int = 1;

	public var inventory : OSInventory;
	
	function OSGrid ( inventory : OSInventory ) {
		this.inventory = inventory;
	}

	function OSGrid ( inventory : OSInventory, width : int, height : int ) {
		this.width = width;
		this.height = height;
	}

	public function Move ( slot : OSSlot, x : int, y : int ) {
		if ( !slot.item ) { return; }
		
		if ( CheckSlot ( x, y, slot.item ) ) {
			slot.x = x;
			slot.y = y;
		}
	}

	public function GetSkippedSlots () : boolean [ , ] {
		return GetSkippedSlots ( null );
	}

	public function GetSkippedSlots ( except : OSItem ) : boolean [ , ] { 
		var skip : boolean [ , ] = new boolean [ width, height ];

		for ( var x : int = 0; x < width; x++ ) {
			for ( var y : int = 0; y < height; y++ ) {
				var slot : OSSlot = inventory.GetSlot ( x, y );

				if ( !slot || slot.hidden || ( slot.item != null && slot.item == except ) ) { continue; }
				
				for ( var sx : int = 0; sx < slot.scale.x; sx++ ) {
					for ( var sy : int = 0; sy < slot.scale.y; sy++ ) {
						if ( ( sx == 0 && sy == 0 ) || x + sx >= width || y + sy >= height ) {
							continue;
						} else {
							skip [ x + sx, y + sy ] = true;
						}
					}
				}
			}
		}

		return skip;
	}

	public function CheckSlot ( x : int, y : int, item : OSItem ) : boolean {
		if ( x < 0 || y < 0 ) {
			return false;
		}
		
		var skip : boolean [ , ] = GetSkippedSlots ( item );
		
		for ( var sx : int = 0; sx < item.slotSize.x; sx++ ) {
			for ( var sy : int = 0; sy < item.slotSize.y; sy++ ) {
				var slot : OSSlot = inventory.GetSlot ( x + sx, y + sy );

				if ( ( x + sx < skip.GetLength(0) && y + sy < skip.GetLength(1) && skip [ x + sx, y + sy ] ) || ( slot && !slot.hidden && slot.item != null && slot.item != item ) || x + sx >= width || y + sy >= height ) {
					return false;
				}
			}
		}

		return true;
	}

	public function GetAvailableCell ( item : OSItem ) : OSPoint {
		var skip : boolean [ , ] = GetSkippedSlots ();

		for ( var y : int = 0; y < height; y++ ) {
			for ( var x : int = 0; x < width; x++ ) {
				var cancel : boolean = false;
				var point : OSPoint = new OSPoint ( x, y );

				for ( var sx : int = 0; sx < item.slotSize.x; sx++ ) {
					for ( var sy : int = 0; sy < item.slotSize.y; sy++ ) {
						var slot : OSSlot = inventory.GetSlot ( x + sx, y + sy );

						if ( slot && !slot.hidden && slot.item != null || x + sx >= width || y + sy >= height || skip [ x + sx, y + sy ] ) {
							cancel = true;
						}
					}
				}
				
				if ( cancel ) {
					continue;

				} else {
					return point;

				}
			}
		}

		return null;
	}
}

public class OSPoint {
	public var x : int = 0;
	public var y : int = 0;

	function OSPoint ( x : int, y : int ) {
		this.x = x;
		this.y = y;
	}

	function OSPoint ( str : String, sep : char, reverse : boolean ) {
		var strings : String[] = str.Split ( sep );

		if ( !reverse ) {
			this.x = int.Parse ( strings[0] );
			this.y = int.Parse ( strings[1] );
		} else {
			this.y = int.Parse ( strings[0] );
			this.x = int.Parse ( strings[1] );
		}
	}

	public static function IsNullOrNegative ( p : OSPoint ) {
		return ( p == null || p.x < 0 || p.y < 0 );
	}
}

public class OSSlot {
	public var item : OSItem;
	public var x : int = 0;
	public var y : int = 0;
	public var quantity : int = 1;
	public var hidden : boolean = false;
	public var equipped : boolean = false;

	function OSSlot () {

	}

	function OSSlot ( x : int, y : int, path : String ) {
		var go : GameObject = Resources.Load ( path ) as GameObject;
		this.x = x;
		this.y = y;
		this.item = go.GetComponent.< OSItem > ();
	}	

	function OSSlot ( x : int, y : int, item : OSItem ) {
		this.x = x;
		this.y = y;
		this.item = item;
	}
	
	function get scale () : OSPoint {
		if ( item ) {
			return item.slotSize;

		} else {
			return new OSPoint ( 1, 1 );
		
		}
	}
}

public class OSInventory extends MonoBehaviour {
	public var definitions : OSDefinitions;
	public var slots : List.< OSSlot > = new List.< OSSlot >();
	public var quickSlots : List.< int > = new List.< int > ();
	public var grid : OSGrid = new OSGrid ( this, 5, 3 );
	public var wallet : OSCurrencyAmount[] = new OSCurrencyAmount[0];
	public var eventHandler : GameObject;

	// Equipped info
	public function GetEquippedItems () : OSItem[] {
		var tmpItems : List.< OSItem > = new List.< OSItem > ();
		
		for ( var i : int = 0; i < slots.Count; i++ ) {
			if ( slots[i] && slots[i].equipped ) {
				tmpItems.Add ( slots[i].item );
			}
		}
		
		return tmpItems.ToArray();
	}

	public function IsEquippedCategory ( category : String ) : boolean {
		for ( var i : int = 0; i < slots.Count; i++ ) {
			if ( slots[i] && slots[i].item.category == category && slots[i].equipped ) {
				return true;
			}
		}

		return false;
	}

	public function IsEquipped ( item : OSItem ) : boolean {
		for ( var i : int = 0; i < slots.Count; i++ ) {
			if ( slots[i] && slots[i].item == item && slots[i].equipped ) {
				return true;
			}
		}

		return false;
	}

	public function SetEquipped ( item : OSItem ) {
		SetEquipped ( item, true );
	}

	public function SetEquipped ( item : OSItem, isEquipped : boolean ) {
		for ( var i : int = 0; i < slots.Count; i++ ) {
			if ( slots[i] && slots[i].item == item ) {
				slots[i].equipped = isEquipped;
				
				if ( eventHandler ) {
					eventHandler.SendMessage ( "OnEquipItem", slots[i].item, SendMessageOptions.DontRequireReceiver );
				}
				
				break;
			}
		}
	}
	
	public function UnequipAll () {
		for ( var i : int = 0; i < slots.Count; i++ ) {
			if ( slots[i] ) {
				slots[i].equipped = false;
				
				if ( eventHandler ) {
					eventHandler.SendMessage ( "OnUnequipAll", SendMessageOptions.DontRequireReceiver );
				}
			}
		}
	}

	// Quick info
	public function SetQuickItem ( item : OSItem, key : int ) {
		quickSlots.Insert ( key, GetItemIndex ( item ) );
	}

	public function GetQuickItem ( index : int ) : OSItem {
		if ( index < quickSlots.Count ) {
			return slots[quickSlots[index]].item;
		
		} else {
			return null;
		}
	}

	public function ClearQuickItem ( index : int ) {
		quickSlots.RemoveAt ( index );
	}

	public function ClearQuickItems () {
		quickSlots.Clear ();
	}

	// Get data
	public function GetItemIndex ( item : OSItem ) : int {
		for ( var i : int = 0; i < slots.Count; i++ ) {
			if ( slots[i].item == item ) {
				return i;
			}
		}
		
		return -1;
	}
	
	public function GetSlot ( x : int, y : int ) : OSSlot {
		for ( var i : int = 0; i < slots.Count; i++ ) {
			if ( slots[i].x == x && slots[i].y == y ) {
				return slots[i];
			}
		}

		return null;
	}

	// Currency
	public function CheckCurrency ( index : int ) {
		var tmpWallet : List.< OSCurrencyAmount > = new List.< OSCurrencyAmount > ( wallet );

		for ( var i : int = 0; i < tmpWallet.Count; i++ ) {
			if ( tmpWallet[i].index == index ) {
				return;
			}
		}

		tmpWallet.Add ( new OSCurrencyAmount ( index ) );

		wallet = tmpWallet.ToArray();
	}
	
	public function ChangeCurrencyAmount ( id : String, amount : int ) {
		for ( var i : int = 0; i < wallet.Length; i++ ) {
			if ( definitions.currencies [ wallet[i].index ].name == id ) {
				wallet[i].amount += amount;
				return;
			}
		}
	}
	
	public function SetCurrencyAmount ( id : String, amount : int ) {
		for ( var i : int = 0; i < wallet.Length; i++ ) {
			if ( definitions.currencies [ wallet[i].index ].name == id ) {
				wallet[i].amount = amount;
				return;
			}
		}
	}
	
	public function GetCurrencyAmount ( id : String ) : int {
		for ( var i : int = 0; i < wallet.Length; i++ ) {
			if ( definitions.currencies [ wallet[i].index ].name == id ) {
				return wallet[i].amount;
			}
		}

		return -1;
	}

	// Search functions
	public function FindItemByCategory ( cat : String, subcat : String ) : OSItem {
		for ( var i : int = 0; i < slots.Count; i++ ) {
			if ( slots[i] && slots[i].item ) {
				if ( cat == slots[i].item.category && subcat == slots[i].item.subcategory ) {
					return slots[i].item;
				}
			}
		}

		return null;
	}

	// Get/set items
	public function SpawnSlot ( slot : OSSlot, parent : Transform, position : Vector3 ) {
		if ( !slot.item ) { return; }
	
		for ( var i : int = 0; i < slot.quantity; i++ ) {	
			var go : GameObject = Instantiate ( Resources.Load ( slot.item.prefabPath ) ) as GameObject;
			var scale : Vector3 = go.transform.localScale;
			var oldItem : OSItem = slot.item; 
			var newItem : OSItem = go.GetComponent.< OSItem > ();

			newItem.AdoptValues ( oldItem );

			go.transform.parent = parent;
			go.transform.position = position;
			go.transform.localScale = scale;
		}
	}
	
	public function DecreaseItem ( item : OSItem ) {
		var slot : OSSlot = GetSlot ( item );

		if ( slot ) {
			DecreaseSlot ( slot );
		}
	}
	
	public function DecreaseSlot ( slot : OSSlot ) {
		slot.quantity--;
		
		if ( slot.quantity < 1 ) {
			RemoveSlot ( slot );
		}
	}

	public function RemoveSlot ( slot : OSSlot ) {
		slot.equipped = false;
		slots.Remove ( slot );
	}
	
	public function RemoveItem ( item : OSItem ) {
		for ( var i : int = 0; i < slots.Count; i++ ) {
			if ( slots[i].item == item ) {
				slots.RemoveAt ( i );
			}
		}
	}
	
	public function AddItemFromScene ( sceneItem : OSItem ) : boolean {
		if ( !sceneItem ) { return false; }
		
		var go : GameObject = Resources.Load ( sceneItem.prefabPath ) as GameObject;

		Destroy ( sceneItem.gameObject );

		return AddItem ( go.GetComponent.< OSItem > () );
	}

	public function AddItem ( item : OSItem ) : boolean {
		if ( !item ) { return false; }
	
		item.definitions = this.definitions;
		
		item.gameObject.SendMessage ( "SetInventory", this, SendMessageOptions.DontRequireReceiver );

		// Check if similar item is already in the inventory
		for ( var i : int = 0; i < slots.Count; i++ ) {
			if ( slots[i].item.id == item.id ) {
			       	if ( item.stackable ) {
					slots[i].quantity++;
				
				} else if ( item.ammunition.enabled ) {
					slots[i].item.ChangeAmmunition ( item.ammunition.value );
				
				}
				
				return true;
			}
		}
		
		// If not, search for available slots
		var availableCell : OSPoint = new OSPoint ( -1, -1 );

		availableCell = grid.GetAvailableCell ( item );

		// Set up reference for item behaviours
		var grenade : OSGrenade = item.GetComponent.< OSGrenade > ();
		var firearm : OSFirearm = item.GetComponent.< OSFirearm > ();

		if ( grenade ) {
			grenade.SetInventory ( this );
		
		} else if ( firearm ) {
			firearm.SetInventory ( this );
		
		}
		
		if ( OSPoint.IsNullOrNegative ( availableCell ) ) {
			return false;

		} else {
			slots.Add ( new OSSlot ( availableCell.x, availableCell.y, item ) );
			return true;

		}

	}

	public function GetSlot ( item : OSItem ) : OSSlot {
		for ( var i : int = 0; i < slots.Count; i++ ) {
			if ( slots[i] && slots[i].item.prefabPath == item.prefabPath ) {
				return slots[i];
			}
		}

		return null;
	}

	public function GetItem ( x : int, y : int ) : OSItem {
		for ( var i : int = 0; i < slots.Count; i++ ) {
			if ( slots[i].x == x && slots[i].y == y ) {
				return slots[i].item;
			}
		}

		return null;
	}
}
