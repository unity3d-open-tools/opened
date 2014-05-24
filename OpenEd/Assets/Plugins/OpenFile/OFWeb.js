#pragma strict

public class OFWeb {
	private static var tempStorage : Dictionary.< String, JSONObject > = new Dictionary.< String, JSONObject > ();

	public static function Set ( path : String, obj : JSONObject ) {
		tempStorage[path] = obj;
	}

	public static function Get ( path : String ) : JSONObject {
		return tempStorage[path];
	}

	public static function Clear () {
		tempStorage.Clear ();
	}

	public static function IsWebPlayer () : boolean { 
		return ( Application.platform == RuntimePlatform.OSXWebPlayer || Application.platform == RuntimePlatform.WindowsWebPlayer );
	}
}
