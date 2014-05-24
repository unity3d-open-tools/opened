#pragma strict

public class OFPlugin {
	public function get types () : System.Type [] { return new System.Type[0]; }
	
	public function Serialize ( input : Component ) : JSONObject {}
	public function Deserialize ( input : JSONObject, output : Component ) {}
	
	public function CheckType ( type : System.Type ) : boolean {
		for ( var i : int = 0; i < types.Length; i++ ) {
			if ( type == types[i] ) {
				return true;	
			}
		}

		return false;
	}
	
	public function CheckType ( typeString : String ) : boolean {
		for ( var i : int = 0; i < types.Length; i++ ) {
			if ( typeString == types[i].ToString () ) {
				return true;	
			}
		}

		return false;
	}
}
