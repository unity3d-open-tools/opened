#pragma strict

public class OEPropertiesInspector extends OEComponentInspector {
	override function get type () : System.Type { return typeof ( OEProperties ); }
	
	override function Inspector () {
		var properties : OEProperties = target.GetComponent.< OEProperties >();

		Offset ( 0, 20 );

		if ( properties.data.list.Count < 1 ) {
			properties.data.AddField ( "title", "Map Title" );
		}

		for ( var i : int = 0; i < properties.data.list.Count; i++ ) {
			var obj : JSONObject = properties.data.list[i];
		
			obj.type = Popup ( "", obj.type, System.Enum.GetNames ( JSONObject.Type ), new Rect ( 0, offset.y, 95, 16 ) ); 	
			properties.data.keys[i] = TextField ( "", properties.data.keys[i], new Rect ( 100, offset.y, 155, 16 ) );
			
			switch ( obj.type ) {
				case JSONObject.Type.STRING:
					obj.str = TextField ( "", obj.str, new Rect ( 260, offset.y, 185, 16 ) );
					break;
				
				case JSONObject.Type.NUMBER:
					obj.n = FloatField ( "", obj.n, new Rect ( 260, offset.y, 185, 16 ) );
					break;
				
				case JSONObject.Type.BOOL:
					obj.b = Toggle ( "", obj.b, new Rect ( 260, offset.y, 16, 16 ) );
					break;
			}
			
			if ( Button ( "x", new Rect ( 450, offset.y, 24, 16 ) ) ) {
				properties.data.list.RemoveAt ( i );
			} 

			Offset ( 0, 20 );
		}

		if ( Button ( "+", new Rect ( 0, offset.y, 24, 16 ) ) ) {
			properties.data.AddField ( "newField", "" );
		}
	}	
}
