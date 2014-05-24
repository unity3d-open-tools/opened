#pragma strict

public class SerializeOpenStash extends OFPlugin {
	override function get types () : System.Type[] {
		return [ typeof ( OSInventory ), typeof ( OSItem ) ];
	}
	
	private function SerializeInventory ( input : OSInventory ) : JSONObject {
		if ( !input ) { return null; }
		
		var output : JSONObject = new JSONObject ( JSONObject.Type.OBJECT );
		var slots : JSONObject = new JSONObject ( JSONObject.Type.ARRAY );

		for ( var slot : OSSlot in input.slots ) {
			var s : JSONObject = new JSONObject ( JSONObject.Type.OBJECT );
			var i : JSONObject = new JSONObject ( JSONObject.Type.OBJECT );

			i.AddField ( "prefabPath", slot.item.prefabPath );
			i.AddField ( "ammunition", slot.item.ammunition.value );

			s.AddField ( "item", i );
			s.AddField ( "x", slot.x );
			s.AddField ( "y", slot.y );
			s.AddField ( "quantity", slot.quantity );
			s.AddField ( "equipped", slot.equipped );
			
			slots.Add ( s );
		}

		var quickSlots : JSONObject = new JSONObject ( JSONObject.Type.ARRAY );

		for ( var quickSlot : int in input.quickSlots ) {
			quickSlots.Add ( quickSlot );
		}

		var grid : JSONObject = new JSONObject ( JSONObject.Type.OBJECT );

		grid.AddField ( "width", input.grid.width );
		grid.AddField ( "height", input.grid.height );

		var wallet : JSONObject = new JSONObject ( JSONObject.Type.ARRAY );

		for ( var currency : OSCurrencyAmount in input.wallet ) {
			var c : JSONObject = new JSONObject ( JSONObject.Type.OBJECT );
			
			c.AddField ( "index", currency.index );
			c.AddField ( "amount", currency.amount );

			wallet.Add ( c );
		}

		output.AddField ( "definitions", input.definitions.prefabPath );
		output.AddField ( "slots", slots );
		output.AddField ( "quickSlots", quickSlots );
		output.AddField ( "grid", grid );
		output.AddField ( "wallet", wallet );

		return output;
	}
	
	private function SerializeItem ( input : OSItem ) : JSONObject {
		if ( !input ) { return null; }
		
		var output : JSONObject = new JSONObject ( JSONObject.Type.OBJECT );
	
		output.AddField ( "ammunition", input.ammunition.value );

		return output;
	}

	override function Serialize ( component : Component ) : JSONObject {
		var item : OSItem = component as OSItem;
		var inventory : OSInventory = component as OSInventory;

		if ( item ) {
			return SerializeItem ( item );
		
		} else if ( item ) {
			return SerializeInventory ( inventory );
		
		} else {
			return null;
		
		}
	}
	
	private function DeserializeInventory ( input : JSONObject, inventory : OSInventory ) {
		var slots : List.< OSSlot > = new List.< OSSlot > ();

		for ( var slot : JSONObject in input.GetField ( "slots" ).list ) {
			var s : OSSlot = new OSSlot ();
			var prefabPath : String = slot.GetField ( "item" ).GetField ( "prefabPath" ).str;
			var go : GameObject = Resources.Load ( prefabPath ) as GameObject;
			var i : OSItem = go.GetComponent.< OSItem > ();

			i.ammunition.value = slot.GetField ( "item" ).GetField ( "ammunition" ).n;
			s.item = i;

			s.x = slot.GetField ( "x" ).n;
			s.y = slot.GetField ( "y" ).n;
			s.quantity = slot.GetField ( "quantity" ).n;
			s.equipped = slot.GetField ( "equipped" ).b;

			slots.Add ( s );
		}
		
		var quickSlots : List.< int > = new List.< int > ();

		for ( var quickSlot : JSONObject in input.GetField ( "quickSlots" ).list ) {
			quickSlots.Add ( quickSlot.n );
		}

		var grid : OSGrid = new OSGrid ( inventory );

		grid.width = input.GetField ( "grid" ).GetField ( "width" ).n;
		grid.height = input.GetField ( "grid" ).GetField ( "height" ).n;

		var wallet : List.< OSCurrencyAmount > = new List.< OSCurrencyAmount > ();

		for ( var currency : JSONObject in input.GetField ( "wallet" ).list ) {
			var c : OSCurrencyAmount = new OSCurrencyAmount ( currency.GetField ( "index" ).n );

			c.amount = currency.GetField ( "amount" ).n;

			wallet.Add ( c );
		}

		var defGO : GameObject = Resources.Load ( input.GetField ( "definitions" ).str ) as GameObject;
		inventory.definitions = defGO.GetComponent.< OSDefinitions > ();
		inventory.slots = slots;
		inventory.quickSlots = quickSlots;
		inventory.grid = grid;
		inventory.wallet = wallet.ToArray ();
	}

	private function DeserializeItem ( input : JSONObject, item : OSItem ) {

	}

	override function Deserialize ( input : JSONObject, component : Component ) {
		var item : OSItem = component as OSItem;
		var inventory : OSInventory = component as OSInventory;

		if ( item ) {
			DeserializeItem ( input, item );
		
		} else if ( item ) {
			DeserializeInventory ( input, inventory );
		
		}
	}
}
