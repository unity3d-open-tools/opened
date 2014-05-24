#pragma strict

public class OFField {
	public var typeIndex : int;
	public var name : String = "";

	public var component : Component;

	private static var plugins : OFPlugin [];
	private static var allTypes : System.Type [];

	public function get type () : System.Type {
		return GetTypes () [ typeIndex ];
	}

	public static function GetTypeByIndex ( i : int ) : System.Type {
		if ( !plugins ) {
			plugins = OFReflector.GetPlugins ();
		}

		var types : System.Type [] = GetTypes ();

		if ( i >= 0 && i < types.Length ) {
			return types [i];

		} else {
			return null;
		}
	}
	
	public static function GetTypeByName ( n : String ) : System.Type {
		if ( !plugins ) {
			plugins = OFReflector.GetPlugins ();
		}

		var types : System.Type [] = GetTypes ();

		for ( var i : int = 0; i < types.Length; i++ ) {
			if ( types[i].ToString().Replace ( "UnityEngine.", "" ) == n ) {
				return types [i];
			}
		}
		
		return null;
	}
	
	public static function GetTypes () : System.Type [] {
		if ( !allTypes ) {
			if ( !plugins ) {
				plugins = OFReflector.GetPlugins ();
			}

			var types : List.< System.Type > = new List.< System.Type > ();
			
			types.Add ( typeof ( AudioSource ) );
			types.Add ( typeof ( Light ) );
			types.Add ( typeof ( Transform ) );

			for ( var i : int = 0; i < plugins.Length; i++ ) {
				for ( var t : int = 0; t < plugins[i].types.Length; t++ ) {
					types.Add ( plugins[i].types[t] );
				}
			}

			allTypes = types.ToArray ();
		}

		return allTypes;
	}

	public static function GetTypeStrings () : String [] {
		var strings : List.< String > = new List.< String > ();
		var types : System.Type [] = GetTypes ();
		
		for ( var i : int = 0; i < types.Length; i++ ) {
			strings.Add ( types[i].ToString ().Replace ( "UnityEngine.", "" ) );
		}

		return strings.ToArray ();
	}
	
	public static function GetComponentType ( value : Component ) : int {
		if ( !plugins ) {
			plugins = OFReflector.GetPlugins ();
		}

		var types : System.Type [] = GetTypes ();
		
		for ( var i : int = 0; i < types.Length; i++ ) {
			if ( types[i] == value.GetType() ) {
				return i;	
			}
		}

		return -1;
	}

	public function Set ( value : Component ) {
		typeIndex = GetComponentType ( value );
		component = value;
	}
}

public class OFSerializedObject extends MonoBehaviour {
	public var fields : OFField [] = new OFField[0];	
	public var id : String = "";
	public var prefabPath : String = "";
	public var exportPath : String = "";

	public function RenewId () {
		id = System.Guid.NewGuid().ToString();
	}

	public function Start () {
		if ( String.IsNullOrEmpty ( id ) ) {
			RenewId ();
		}
	}

	public function SetField ( name : String, value : Component ) {
		var tmpFields : List.< OFField > = new List.< OFField > ( fields );
		var found : boolean = false;

		for ( var i : int = 0; i < tmpFields.Count; i++ ) {
			if ( tmpFields[i].name == name ) {
				tmpFields[i].Set ( value );
				found = true;
				break;
			}
		}

		if ( !found ) {
			var newField : OFField = new OFField ();
			newField.name = name;
			newField.Set ( value );
			tmpFields.Add ( newField );
		}

		fields = tmpFields.ToArray ();
	}
	
	public function HasFieldType ( type : System.Type ) : boolean {
		for ( var i : int = 0; i < fields.Length; i++ ) {
			if ( fields[i].type == type ) {
				return true;
			}
		}
		
		return false;
	}

	public function HasField ( name : String ) : boolean {
		for ( var i : int = 0; i < fields.Length; i++ ) {
			if ( fields[i].name == name ) {
				return true;
			}
		}
		
		return false;
	}

	public function RemoveField ( name : String ) {
		var tmpFields : List.< OFField > = new List.< OFField > ( fields );

		for ( var i : int = 0; i < tmpFields.Count; i++ ) {
			if ( tmpFields[i].name == name ) {
				tmpFields.RemoveAt ( i );
				break;
			}
		}

		fields = tmpFields.ToArray ();
	}

	public function GetComponentType ( type : System.Type ) : Component {
		for ( var i : int = 0; i < fields.Length; i++ ) {
			if ( fields[i] && fields[i].component && fields[i].type == type ) {
				return fields[i].component;
			}
		}
		
		return null;
	}

	public static function FindObject ( id : String ) : OFSerializedObject {
		var result : OFSerializedObject;
		var allObjects : OFSerializedObject[] = GameObject.FindObjectsOfType.<OFSerializedObject>();

		for ( var i : int = 0; i < allObjects.Length; i++ ) {
			if ( allObjects[i].id == id ) {
				result = allObjects[i];
				break;
			}	
		}

		return result;
	}

	public static function GetAllInScene () : OFSerializedObject [] {
		return GameObject.FindObjectsOfType.<OFSerializedObject>();
	}
}
