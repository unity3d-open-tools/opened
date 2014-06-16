#pragma strict

public class OFAssetLink {
	public enum Type {
		Bundle,
		File,
		Resource,
	}

	public var type : Type = Type.Resource;
	public var name : String;
	public var resourcePath : String;
	public var filePath : String;
	public var bundlePath : String;

	private var texture : Texture2D;
	private var audioClip : AudioClip;

	public function Reset () {
		texture = null;
		audioClip = null;
		resourcePath = "";
		filePath = "";
		bundlePath = "";
	}

	public function GetLinkType () : Type {
		if ( !String.IsNullOrEmpty ( filePath ) ) {
			return Type.File;
		
		} else if ( !String.IsNullOrEmpty ( resourcePath ) ) {
			return Type.Resource;

		} else if ( !String.IsNullOrEmpty ( bundlePath ) ) {
			return Type.Bundle;

		} else {
			return -1;

		}
	}

	public function GetAudioClip () : AudioClip {
		if ( audioClip == null && !String.IsNullOrEmpty ( resourcePath ) ) {
			audioClip = Resources.Load ( resourcePath ) as AudioClip;
		
		} else if ( audioClip == null && !String.IsNullOrEmpty ( bundlePath ) ) {
			var strings : String [] = bundlePath.Split ( ">"[0] );
			var bundle : OFBundle = OFBundleManager.instance.GetBundle ( strings [0] );
			
			if ( bundle ) {
				audioClip = bundle.GetAudioClip ( strings[1] );
			}
		}

		return audioClip;
	}

	public function GetAudioClip ( callback : System.Action.< AudioClip > ) : IEnumerator {
		if ( audioClip == null && !String.IsNullOrEmpty ( filePath ) ) {
			var www : WWW = new WWW ( filePath );

			yield www;

			audioClip = www.audioClip;

			callback ( audioClip );
		
		} else {
			callback ( audioClip );

		}
	}
	
	public function GetTexture () : Texture2D {
		if ( texture == null && !String.IsNullOrEmpty ( resourcePath ) ) {
			texture = Resources.Load ( resourcePath ) as Texture2D;
		
		} else if ( texture == null && !String.IsNullOrEmpty ( bundlePath ) ) {
			var strings : String [] = bundlePath.Split ( ">"[0] );
			var bundle : OFBundle = OFBundleManager.instance.GetBundle ( strings [0] );
			
			if ( bundle ) {
				texture = bundle.GetTexture ( strings[1] );
			}
		}

		return texture;
	}

	public function GetTexture ( callback : System.Action.< Texture2D > ) : IEnumerator {
		if ( texture == null && !String.IsNullOrEmpty ( filePath ) ) {
			var www : WWW = new WWW ( filePath );

			yield www;

			texture = www.texture;

			callback ( texture );
		
		} else {
			callback ( texture );

		}
	}
}

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
	public var assetLinks : OFAssetLink [] = new OFAssetLink[0];
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

	public function ClearAssetLinks () {
		assetLinks = new OFAssetLink[0];
	}

	public function AddAssetLink ( name : String, path : String, type : OFAssetLink.Type ) {
		var tmp : List.< OFAssetLink > = new List.< OFAssetLink > ( assetLinks );

		var link : OFAssetLink = new OFAssetLink ();
		
		link.name = name;

		switch ( type ) {
			case OFAssetLink.Type.File:
				link.filePath = path;
				break;
		
			case OFAssetLink.Type.Resource:
				link.resourcePath = path;
				break;
		
			case OFAssetLink.Type.Bundle:
				link.bundlePath = path;
				break;
		}

		tmp.Add ( link );

		assetLinks = tmp.ToArray ();
	}

	public function GetAssetLink ( name : String ) : OFAssetLink {
		for ( var i : int = 0; i < assetLinks.Length; i++ ) {
			if ( assetLinks[i].name == name ) {
				return assetLinks[i];
			}
		}
		
		return null;
	}
	
	public function RemoveAssetLink ( name : String ) {
		var tmp : List.< OFAssetLink > = new List.< OFAssetLink > ( assetLinks );
		
		for ( var i : int = tmp.Count - 1; i >= 0; i-- ) {
			if ( tmp[i].name == name ) {
				tmp.RemoveAt ( i );
			}
		}
		
		assetLinks = tmp.ToArray ();
	}

	public function SetAssetLink ( name : String, path : String, type : OFAssetLink.Type ) {
		for ( var i : int = 0; i < assetLinks.Length; i++ ) {
			if ( assetLinks[i].name == name ) {
				assetLinks[i].Reset ();
				
				switch ( type ) {
					case OFAssetLink.Type.File:
						assetLinks[i].filePath = path;
						break;
				
					case OFAssetLink.Type.Bundle:
						assetLinks[i].bundlePath = path;
						break;
						
					case OFAssetLink.Type.Resource:
						assetLinks[i].resourcePath = path;
						break;
				}

				return;
			}
		}

		AddAssetLink ( name, path, type );
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
