#pragma strict

public class OEField {
	@NonSerialized public var enabled : boolean = true;
	@NonSerialized public var setCounter : int = 0;
	@NonSerialized public var scale : Vector2 = new Vector2 ( 140, 16 );

	public function get canSet () : boolean {
		if ( setCounter > 0 ) {
			setCounter--;
		}
		
		return setCounter == 0;
	}

	public function set canSet ( value : boolean ) {
		setCounter = value ? 2 : -1;
	}
	
	public function Update ( text : String, pos : Vector2, scale : Vector2 ) {}

	public function Destroy () {}

	public static function New ( type : System.Type, transform : Transform ) : OEField {
		if ( type == typeof ( OEToggle ) ) {
			return new OEToggle ( transform );
			
		} else if ( type == typeof ( OEAssetLinkField ) ) {
			return new OEAssetLinkField ( transform );

		} else if ( type == typeof ( OEFloatField ) ) {
			return new OEFloatField ( transform );
		
		} else if ( type == typeof ( OELabelField ) ) {
			return new OELabelField ( transform );
		
		} else if ( type == typeof ( OETexture ) ) {
			return new OETexture ( transform );
		
		} else if ( type == typeof ( OEBox ) ) {
			return new OEBox ( transform );
		
		} else if ( type == typeof ( OEIntField ) ) {
			return new OEIntField ( transform );
		
		} else if ( type == typeof ( OETextField ) ) {
			return new OETextField ( transform );
		
		} else if ( type == typeof ( OEObjectField ) ) {
			return new OEObjectField ( transform );
		
		} else if ( type == typeof ( OEColorField ) ) {
			return new OEColorField ( transform );
		
		} else if ( type == typeof ( OESlider ) ) {
			return new OESlider ( transform );
		
		} else if ( type == typeof ( OEButton ) ) {
			return new OEButton ( transform );
		
		} else if ( type == typeof ( OEVector3Field ) ) {
			return new OEVector3Field ( transform );
		
		} else if ( type == typeof ( OEPopup ) ) {
			return new OEPopup ( transform );
		
		} else if ( type == typeof ( OEPointField ) ) {
			return new OEPointField ( transform );
		
		}

		return null;	
	}
}

public class OEVector3Field extends OEField {
	public var x : OGTextField;
	public var y : OGTextField;
	public var z : OGTextField;
	public var title : OGLabel;

	function OEVector3Field ( parent : Transform ) {
		x = new GameObject ( "fld_X" ).AddComponent.< OGTextField > ();
		y = new GameObject ( "fld_Y" ).AddComponent.< OGTextField > ();
		z = new GameObject ( "fld_Z" ).AddComponent.< OGTextField > ();
		title = new GameObject ( "lbl_Vector3" ).AddComponent.< OGLabel > ();

		x.transform.parent = parent;
		y.transform.parent = parent;
		z.transform.parent = parent;
		title.transform.parent = parent;
		
		x.ApplyDefaultStyles ();
		y.ApplyDefaultStyles ();
		z.ApplyDefaultStyles ();
		title.ApplyDefaultStyles ();
	}

	override function Destroy () {
		MonoBehaviour.Destroy ( x.gameObject );
		MonoBehaviour.Destroy ( y.gameObject );
		MonoBehaviour.Destroy ( z.gameObject );
		MonoBehaviour.Destroy ( title.gameObject );
	}

	override function Update ( text : String, pos : Vector2, scale : Vector2 ) {
		title.text = text;
		title.tint.a = enabled ? 1.0 : 0.5;
		
		x.tint.a = enabled ? 1.0 : 0.5;
		x.isDisabled = !enabled;
		
		y.tint.a = enabled ? 1.0 : 0.5;
		y.isDisabled = !enabled;
		
		z.tint.a = enabled ? 1.0 : 0.5;
		z.isDisabled = !enabled;

		if ( !String.IsNullOrEmpty ( text ) ) {
			title.transform.localPosition = new Vector3 ( pos.x, pos.y, 0 );
			title.transform.localScale = new Vector3 ( scale.x / 2, scale.y, 1 );
			
			x.transform.localPosition = new Vector3 ( pos.x + scale.x / 2, pos.y, 0 );
			x.transform.localScale = new Vector3 ( scale.x / 6, scale.y, 1 );

			y.transform.localPosition = new Vector3 ( pos.x + scale.x / 2 + scale.x / 6, pos.y, 0 );
			y.transform.localScale = new Vector3 ( scale.x / 6, scale.y, 1 );
			
			z.transform.localPosition = new Vector3 ( pos.x + scale.x / 2 + ( ( scale.x / 6 ) * 2 ), pos.y, 0 );
			z.transform.localScale = new Vector3 ( scale.x / 6, scale.y, 1 );

		} else {
			x.transform.localPosition = new Vector3 ( pos.x, pos.y, 0 );
			x.transform.localScale = new Vector3 ( scale.x / 3, scale.y, 1 );

			y.transform.localPosition = new Vector3 ( pos.x + scale.x / 3, pos.y, 0 );
			y.transform.localScale = new Vector3 ( scale.x / 3, scale.y, 1 );
			
			z.transform.localPosition = new Vector3 ( pos.x + ( ( scale.x / 3 ) * 2 ), pos.y, 0 );
			z.transform.localScale = new Vector3 ( scale.x / 3, scale.y, 1 );

		}
	}

	public function get listening () : boolean {
		return x.listening || y.listening || z.listening;
	}

	public function Set ( v : Vector3 ) : Vector3 {
		if ( !listening ) {
			x.text = ( Mathf.Round ( v.x * 1000 ) / 1000 ).ToString();
			y.text = ( Mathf.Round ( v.y * 1000 ) / 1000 ).ToString();
			z.text = ( Mathf.Round ( v.z * 1000 ) / 1000 ).ToString();
		}

		return Out();
	}

	public function Out () : Vector3 {
		var nx : float;
		var ny : float; 
		var nz : float;
		
		x.text = x.text.Replace ( "\n", "" );
		y.text = y.text.Replace ( "\n", "" );
		z.text = z.text.Replace ( "\n", "" );

		float.TryParse ( x.text, nx );
		float.TryParse ( y.text, ny );
		float.TryParse ( z.text, nz );

		return new Vector3 ( nx, ny, nz );
	}
}

public class OEColorField extends OEField {
	public var r : OGTextField;
	public var g : OGTextField;
	public var b : OGTextField;
	public var a : OGTextField;
	public var title : OGLabel;

	public function get listening () : boolean {
		return r.listening || g.listening || b.listening || a.listening;
	}

	public function Set ( c : Color ) : Color {
		if ( !listening ) {
			r.text = ( Mathf.Round ( c.r * 1000 ) / 1000 ).ToString();
			g.text = ( Mathf.Round ( c.g * 1000 ) / 1000 ).ToString();
			b.text = ( Mathf.Round ( c.b * 1000 ) / 1000 ).ToString();
			a.text = ( Mathf.Round ( c.a * 1000 ) / 1000 ).ToString();
		}

		return Out ();
	}

	function OEColorField ( parent : Transform ) {
		r = new GameObject ( "fld_R" ).AddComponent.< OGTextField > ();
		g = new GameObject ( "fld_G" ).AddComponent.< OGTextField > ();
		b = new GameObject ( "fld_B" ).AddComponent.< OGTextField > ();
		a = new GameObject ( "fld_A" ).AddComponent.< OGTextField > ();
		title = new GameObject ( "lbl_Vector3" ).AddComponent.< OGLabel > ();

		r.transform.parent = parent;
		g.transform.parent = parent;
		b.transform.parent = parent;
		a.transform.parent = parent;
		title.transform.parent = parent;
		
		r.ApplyDefaultStyles ();
		g.ApplyDefaultStyles ();
		b.ApplyDefaultStyles ();
		a.ApplyDefaultStyles ();
		title.ApplyDefaultStyles ();
	}

	override function Destroy () {
		MonoBehaviour.Destroy ( r.gameObject );
		MonoBehaviour.Destroy ( g.gameObject );
		MonoBehaviour.Destroy ( b.gameObject );
		MonoBehaviour.Destroy ( a.gameObject );
		MonoBehaviour.Destroy ( title.gameObject );
	}

	override function Update ( text : String, pos : Vector2, scale : Vector2 ) {
		title.text = text;
		title.tint.a = enabled ? 1.0 : 0.5;
		
		r.tint.a = enabled ? 1.0 : 0.5;
		r.isDisabled = !enabled;
		
		g.tint.a = enabled ? 1.0 : 0.5;
		g.isDisabled = !enabled;
		
		b.tint.a = enabled ? 1.0 : 0.5;
		b.isDisabled = !enabled;

		a.tint.a = enabled ? 1.0 : 0.5;
		a.isDisabled = !enabled;

		if ( !String.IsNullOrEmpty ( text ) ) {
			title.transform.localPosition = new Vector3 ( pos.x, pos.y, 0 );
			title.transform.localScale = new Vector3 ( scale.x / 2, scale.y, 1 );
			
			r.transform.localPosition = new Vector3 ( pos.x + scale.x / 2, pos.y, 0 );
			r.transform.localScale = new Vector3 ( scale.x / 8, scale.y, 1 );

			g.transform.localPosition = new Vector3 ( pos.x + scale.x / 2 + scale.x / 8, pos.y, 0 );
			g.transform.localScale = new Vector3 ( scale.x / 8, scale.y, 1 );
			
			b.transform.localPosition = new Vector3 ( pos.x + scale.x / 2 + ( ( scale.x / 8 ) * 2 ), pos.y, 0 );
			b.transform.localScale = new Vector3 ( scale.x / 8, scale.y, 1 );
			
			a.transform.localPosition = new Vector3 ( pos.x + scale.x / 2 + ( ( scale.x / 8 ) * 3 ), pos.y, 0 );
			a.transform.localScale = new Vector3 ( scale.x / 8, scale.y, 1 );

		} else {
			r.transform.localPosition = new Vector3 ( pos.x, pos.y, 0 );
			r.transform.localScale = new Vector3 ( scale.x / 4, scale.y, 1 );

			g.transform.localPosition = new Vector3 ( pos.x + scale.x / 4, pos.y, 0 );
			g.transform.localScale = new Vector3 ( scale.x / 4, scale.y, 1 );
			
			b.transform.localPosition = new Vector3 ( pos.x + ( ( scale.x / 4 ) * 2 ), pos.y, 0 );
			b.transform.localScale = new Vector3 ( scale.x / 4, scale.y, 1 );
			
			a.transform.localPosition = new Vector3 ( pos.x + ( ( scale.x / 4 ) * 3 ), pos.y, 0 );
			a.transform.localScale = new Vector3 ( scale.x / 4, scale.y, 1 );

		}
	}

	public function Out () : Color {
		var nr : float;
		var ng : float; 
		var nb : float;
		var na : float;
		
		r.text = r.text.Replace ( "\n", "" );
		g.text = g.text.Replace ( "\n", "" );
		b.text = b.text.Replace ( "\n", "" );
		a.text = a.text.Replace ( "\n", "" );

		float.TryParse ( r.text, nr );
		float.TryParse ( g.text, ng );
		float.TryParse ( b.text, nb );
		float.TryParse ( a.text, na );

		return new Color ( nr, ng, nb, na );
	}
}

public class OEButton extends OEField {
	public var button : OGButton;

	private var clicked : boolean = false;

	function OEButton ( parent : Transform ) {
		button = new GameObject ( "btn_Button" ).AddComponent.< OGButton > ();
		button.transform.parent = parent;
		button.ApplyDefaultStyles ();
	}
	
	override function Destroy () {
		MonoBehaviour.Destroy ( button.gameObject );
	}
	
	override function Update ( text : String, pos : Vector2, scale : Vector2 ) {
		button.text = text;
		button.tint.a = enabled ? 1.0 : 0.5;
		button.isDisabled = !enabled;

		button.transform.localPosition = new Vector3 ( pos.x, pos.y, 0 );
		button.transform.localScale = new Vector3 ( scale.x, scale.y, 1 );
	}

	public function Set () : boolean {
		button.func = function () {
			if ( enabled ) {
				clicked = true;
			}
		};

		var wasClicked : boolean = clicked;
		clicked = false;

		return wasClicked;
	}
}

public class OEPointField extends OEField {
	public var button : OGButton;
	public var title : OGLabel;

	private var pos : Vector3;
	
	function OEPointField ( parent : Transform ) {
		title = new GameObject ( "lbl_Point" ).AddComponent.< OGLabel > ();
		button = new GameObject ( "btn_Point" ).AddComponent.< OGButton > ();

		title.transform.parent = parent;
		button.transform.parent = parent;
		
		title.ApplyDefaultStyles ();
		button.ApplyDefaultStyles ();
	}
	
	override function Destroy () {
		MonoBehaviour.Destroy ( title.gameObject );
		MonoBehaviour.Destroy ( button.gameObject );
	}
	
	override function Update ( text : String, pos : Vector2, scale : Vector2 ) {
		title.text = text;

		title.tint.a = enabled ? 1.0 : 0.5;
		button.tint.a = enabled ? 1.0 : 0.5;
		button.isDisabled = !enabled;

		if ( !String.IsNullOrEmpty ( text ) ) {
			title.transform.localPosition = new Vector3 ( pos.x, pos.y, 0 );
			title.transform.localScale = new Vector3 ( scale.x / 2, scale.y, 1 );
			button.transform.localPosition = new Vector3 ( pos.x + scale.x / 2, pos.y, 0 );
			button.transform.localScale = new Vector3 ( scale.x / 2, scale.y, 1 );
		
		} else {
			button.transform.localPosition = new Vector3 ( pos.x, pos.y, 0 );
			button.transform.localScale = new Vector3 ( scale.x, scale.y, 1 );
		}
	}
		
	public function Set ( p : Vector3 ) : Vector3 {
		if ( canSet ) {
			pos = p;

			button.func = function () {
				canSet = false;

				OEWorkspace.GetInstance().PickPoint ( function ( picked : Vector3 ) {
					picked.x = Mathf.Round ( picked.x * 10 ) / 10;
					picked.y = Mathf.Round ( picked.y * 10 ) / 10;
					picked.z = Mathf.Round ( picked.z * 10 ) / 10;
					
					pos = picked;
					canSet = true;
				} );
			};
		}

		return Out ();
	}

	public function Out () : Vector3 {
		button.text = pos.x + "," + pos.y + "," + pos.x;
		
		return pos;
	}
}

public class OEAssetLinkField extends OEField {
	public var title : OGLabel;
	public var popup : OGPopUp;

	private var target : OFSerializedObject;
	private var object : Object;

	function OEAssetLinkField ( parent : Transform ) {
		title = new GameObject ( "lbl_AssetLink" ).AddComponent.< OGLabel > ();
		popup = new GameObject ( "btn_AssetLink" ).AddComponent.< OGPopUp > ();

		title.transform.parent = parent;
		popup.transform.parent = parent;
		
		title.ApplyDefaultStyles ();
		popup.ApplyDefaultStyles ();
	}

	override function Destroy () {
		MonoBehaviour.Destroy ( title.gameObject );
		MonoBehaviour.Destroy ( popup.gameObject );
	}
	
	override function Update ( text : String, pos : Vector2, scale : Vector2 ) {
		title.text = text;

		title.tint.a = enabled ? 1.0 : 0.5;
		popup.tint.a = enabled ? 1.0 : 0.5;
		popup.isDisabled = !enabled;

		if ( !String.IsNullOrEmpty ( text ) ) {
			title.transform.localPosition = new Vector3 ( pos.x, pos.y, 0 );
			title.transform.localScale = new Vector3 ( scale.x / 2, scale.y, 1 );
			popup.transform.localPosition = new Vector3 ( pos.x + scale.x / 2, pos.y, 0 );
			popup.transform.localScale = new Vector3 ( scale.x / 2, scale.y, 1 );
		
		} else {
			popup.transform.localPosition = new Vector3 ( pos.x, pos.y, 0 );
			popup.transform.localScale = new Vector3 ( scale.x, scale.y, 1 );
		}
	}

	public function Set ( linkName : String, target : OFSerializedObject, type : System.Type ) : Object {
		return Set ( linkName, target, type, "" );
	}

	public function Set ( linkName : String, target : OFSerializedObject, sysType : System.Type, strType : String ) : Object {
		this.target = target;
	
		var assetLink : OFAssetLink = this.target.GetAssetLink ( linkName );

		if ( assetLink ) {
			if ( sysType == typeof ( Texture2D ) ) {
				object = assetLink.GetTexture ();
			
			} else if ( sysType == typeof ( AudioClip ) ) {
				object = assetLink.GetAudioClip ();

			}
		
		} else {
			object = null;

		}

		var uObject : UnityEngine.Object = object as UnityEngine.Object;
		var objectName : String = "None";

		if ( uObject != null ) {
			if ( uObject.name.Length > 15 ) {
				objectName = uObject.name.Substring ( 0, 15 ) + "..."; 
			
			} else {
				objectName = uObject.name;
			
			}
		}
		
		popup.title = objectName;
		popup.options = [ "Load resource...", "Load file...", "(None)" ];

		if ( popup.selectedOption == "Load resource..." ) {
			popup.selectedOption = "";
			OEWorkspace.GetInstance().PickResource ( function ( path : String ) {
				this.target.SetAssetLink ( linkName, path, path.Contains ( ">" ) ? OFAssetLink.Type.Bundle : OFAssetLink.Type.Resource );
			}, sysType, true );
		
		} else if ( popup.selectedOption == "Load file..." ) {
			popup.selectedOption = "";
			OEWorkspace.GetInstance().PickFile ( function ( path : String ) {
				this.target.SetAssetLink ( linkName, path, OFAssetLink.Type.File );
			}, strType );

		} else if ( popup.selectedOption == "(None)" ) {
			popup.selectedOption = "";
			object == null;

			if ( assetLink ) {
				assetLink.Reset ();
			}
				
		}
		
		return Out ();
	}

	public function Out () : Object {
		return object;
	}
}

public class OEObjectField extends OEField {
	public enum Target {
		Prefab,
		Scene
	}
	
	public class Tuple {
		public var object : Object;
		public var path : String;
	
		function Tuple ( path : String, object : Object ) {
			this.path = path;
			this.object = object;
		}
	}

	public var title : OGLabel;
	public var button : OGButton;
	public var clear : OGButton; 

	private var obj : Object;
	private var forcedName : String;
	private var path : String;
	private var usePath : boolean = false;

	function OEObjectField ( parent : Transform ) {
		title = new GameObject ( "lbl_Object" ).AddComponent.< OGLabel > ();
		button = new GameObject ( "btn_Object" ).AddComponent.< OGButton > ();
		clear = new GameObject ( "btn_Clear" ).AddComponent.< OGButton > ();

		title.transform.parent = parent;
		button.transform.parent = parent;
		clear.transform.parent = parent;
		
		title.ApplyDefaultStyles ();
		button.ApplyDefaultStyles ();
		clear.ApplyDefaultStyles ();
	}

	override function Destroy () {
		MonoBehaviour.Destroy ( title.gameObject );
		MonoBehaviour.Destroy ( button.gameObject );
		MonoBehaviour.Destroy ( clear.gameObject );
	}

	override function Update ( text : String, pos : Vector2, scale : Vector2 ) {
		title.text = text;
		clear.text = "x";
		clear.tint = Color.red;

		title.tint.a = enabled ? 1.0 : 0.5;
		button.tint.a = enabled ? 1.0 : 0.5;
		button.isDisabled = !enabled;
		clear.tint.a = enabled ? 1.0 : 0.5;
		clear.isDisabled = !enabled;

		if ( !String.IsNullOrEmpty ( text ) ) {
			title.transform.localPosition = new Vector3 ( pos.x, pos.y, 0 );
			title.transform.localScale = new Vector3 ( scale.x / 2, scale.y, 1 );
			button.transform.localPosition = new Vector3 ( pos.x + scale.x / 2, pos.y, 0 );
			button.transform.localScale = new Vector3 ( scale.x / 2 - ( scale.y + 5 ), scale.y, 1 );
			clear.transform.localPosition = new Vector3 ( pos.x + scale.x - scale.y, pos.y, 0 );
			clear.transform.localScale = new Vector3 ( scale.y, scale.y, 1 );
		
		} else {
			button.transform.localPosition = new Vector3 ( pos.x, pos.y, 0 );
			button.transform.localScale = new Vector3 ( scale.x - ( scale.y + 5 ), scale.y, 1 );
			clear.transform.localPosition = new Vector3 ( pos.x + scale.x - scale.y, pos.y, 0 );
			clear.transform.localScale = new Vector3 ( scale.y, scale.y, 1 );
		
		}
	}

	public function Clear () {
		obj = null;
		setCounter = 10;
		path = "";
	}

	public function Set ( setObj : Object, sysType : System.Type, strType : String ) : Object {
		return Set ( setObj, sysType, strType, null );
	}

	public function Set ( setObj : Object, sysType : System.Type, strType : String, attachTo : OFSerializedObject ) : Object {
		if ( canSet ) {
			if ( setObj.GetType() == typeof ( String ) ) {
				path = setObj as String;
				usePath = true;
			
				if ( obj == null && !String.IsNullOrEmpty ( path ) ) {
					var json : JSONObject = OFReader.LoadFile ( path );
					var so : OFSerializedObject = OFDeserializer.Deserialize ( json, attachTo );
					obj = so.GetComponent ( sysType );
				}

			} else {
				obj = setObj;

			}
		}
		
		button.func = function () {
			canSet = false;
			
			OEWorkspace.GetInstance().PickFile ( function ( file : System.IO.FileInfo ) {
				path = file.FullName;
				
				var json : JSONObject = OFReader.LoadFile ( path );
				var so : OFSerializedObject = OFDeserializer.Deserialize ( json, attachTo );
				obj = so.GetComponent ( sysType );
				forcedName = file.Name;

				canSet = true;
			}, strType );
		};

		return Out ();
	}

	public function Set ( setObj : Object, sysType : System.Type, target : Target ) : Object {
		if ( canSet ) {
			obj = setObj;
		}
		
		button.func = function () {
			canSet = false;
			forcedName = "";
			
			switch ( target ) {		
				case Target.Scene:
					OEWorkspace.GetInstance().PickObject ( function ( picked : Object ) {
						obj = picked;
						canSet = true;
					}, sysType );
					break;
				
				case Target.Prefab:
					OEWorkspace.GetInstance().PickPrefab ( function ( picked : Object ) {
						obj = picked;
						canSet = true;
						OEWorkspace.GetInstance().toolbar.Clear ();
					}, sysType );
					break;
			}
		};

		return Out ();
	}

	public function Out () : Object {
		clear.func = Clear;
		
		var go : GameObject;
		var o : UnityEngine.Object;
		var name : String;

		if ( !usePath ) {
			if ( obj ) {
				var c : Component = obj as Component;
				o = obj as UnityEngine.Object;

				if ( c ) {
					go = c.gameObject;
				} else {
					go = obj as GameObject;
				}

			}

			if ( go ) {
				name = go.name;
			
			} else if ( o ) {
				name = o.name;

			} else {
				name = "None";

			}
		
		} else {
			if ( String.IsNullOrEmpty ( path ) ) {
				name = "None";

			} else {
				var split : String [];
				 
				if ( path.Contains ( "\\" ) ) {
					split = path.Split ( "\\"[0] );
				} else {	
					split = path.Split ( "/"[0] );
				}

				name = split [ split.Length - 1 ];
			}
		}
		
		if ( name.Length > 15 ) {
			name = name.Substring ( 0, 15 ) + "...";
		}
		
		button.text = name;

		if ( usePath ) {
			return new Tuple ( path, obj );
		} else {
			return obj;
		}
	}
}

public class OETexture extends OEField {
	public var texture : OGTexture;
	
	function OETexture ( parent : Transform ) {
		texture = new GameObject ( "tex_Texture" ).AddComponent.< OGTexture > ();
		
		texture.transform.parent = parent;
	}

	override function Destroy () {
		MonoBehaviour.Destroy ( texture.gameObject );
	}

	override function Update ( text : String, pos : Vector2, scale : Vector2 ) {
		texture.tint.a = enabled ? 1.0 : 0.5;
		
		texture.transform.localPosition = new Vector3 ( pos.x, pos.y, 0 );
		texture.transform.localScale = new Vector3 ( scale.x, scale.y, 1 );
	}
}

public class OELabelField extends OEField {
	public var label : OGLabel;
	
	function OELabelField ( parent : Transform ) {
		label = new GameObject ( "lbl_Label" ).AddComponent.< OGLabel > ();
		
		label.transform.parent = parent;
			
		label.ApplyDefaultStyles ();
	}

	override function Destroy () {
		MonoBehaviour.Destroy ( label.gameObject );
	}

	override function Update ( text : String, pos : Vector2, scale : Vector2 ) {
		label.tint.a = enabled ? 1.0 : 0.5;
		
		label.text = text;
		label.transform.localPosition = new Vector3 ( pos.x, pos.y, 0 );
		label.transform.localScale = new Vector3 ( scale.x, scale.y, 1 );
	}
}

public class OEBox extends OEField {
	public var sprite : OGSlicedSprite;
	
	function OEBox ( parent : Transform ) {
		sprite = new GameObject ( "img_Box" ).AddComponent.< OGSlicedSprite > ();
		
		sprite.transform.parent = parent;
			
		sprite.ApplyDefaultStyles ();
	}

	override function Destroy () {
		MonoBehaviour.Destroy ( sprite.gameObject );
	}

	override function Update ( text : String, pos : Vector2, scale : Vector2 ) {
		sprite.tint.a = enabled ? 1.0 : 0.5;
		
		sprite.transform.localPosition = new Vector3 ( pos.x, pos.y, 2 );
		sprite.transform.localScale = new Vector3 ( scale.x, scale.y, 1 );
	}
}

public class OEPopup extends OEField {
	public var popup : OGPopUp;
	public var title : OGLabel;

	function OEPopup ( parent : Transform ) {
		popup = new GameObject ( "pop_Popup" ).AddComponent.< OGPopUp > ();
		title = new GameObject ( "lbl_Popup" ).AddComponent.< OGLabel > ();

		popup.transform.parent = parent;
		title.transform.parent = parent;
		
		popup.ApplyDefaultStyles ();
		title.ApplyDefaultStyles ();
	}

	override function Destroy () {
		MonoBehaviour.Destroy ( popup.gameObject );
		MonoBehaviour.Destroy ( title.gameObject );
	}

	override function Update ( text : String, pos : Vector2, scale : Vector2 ) {
		title.text = text;
		
		if ( !String.IsNullOrEmpty ( text ) ) {
			popup.title = "< " + text.ToLower() + " >";
		
		} else {
			popup.title = "...";
		
		}

		title.tint.a = enabled ? 1.0 : 0.5;
		popup.tint.a = enabled ? 1.0 : 0.5;
		popup.isDisabled = !enabled;

		if ( !String.IsNullOrEmpty ( text ) ) {
			title.transform.localPosition = new Vector3 ( pos.x, pos.y, 0 );
			title.transform.localScale = new Vector3 ( scale.x / 2, scale.y, 1 );
			popup.transform.localPosition = new Vector3 ( pos.x + scale.x / 2, pos.y, popup.isUp ? -5 : 0 );
			popup.transform.localScale = new Vector3 ( scale.x / 2, scale.y, 1 );
		
		} else {
			popup.transform.localPosition = new Vector3 ( pos.x, pos.y, popup.isUp ? -5 : 0 );
			popup.transform.localScale = new Vector3 ( scale.x, scale.y, 1 );
		
		}
	}
	
	public function Set ( selected : int, strings : String [] ) : int {
		if ( canSet ) {
			popup.options = strings;
			if ( strings.Length > 0 ) {
				popup.selectedOption = strings[selected];
			} else {
				popup.selectedOption = "";
			}
		}
		
		setCounter = popup.isUp ? -1 : 0;

		return Out ();
	}

	public function Out () : int {
		for ( var i : int = 0; i < popup.options.Length; i++ ) {
			if ( popup.selectedOption == popup.options[i] ) {
				return i;
			}
		}
		
		return 0;
	}	
}

public class OEToggle extends OEField {
	public var tickbox : OGTickBox;

	function OEToggle ( parent : Transform ) {
		tickbox = new GameObject ( "tbx_Toggle" ).AddComponent.< OGTickBox > ();
		
		tickbox.transform.parent = parent;
			
		tickbox.ApplyDefaultStyles ();
	}

	override function Destroy () {
		MonoBehaviour.Destroy ( tickbox.gameObject );
	}

	override function Update ( text : String, pos : Vector2, scale : Vector2 ) {
		tickbox.tint.a = enabled ? 1.0 : 0.5;
		tickbox.isDisabled = !enabled;
		
		tickbox.text = text;
		tickbox.transform.localPosition = new Vector3 ( pos.x, pos.y, 0 );
		tickbox.transform.localScale = new Vector3 ( scale.x / 2 + scale.y * 0.75, scale.y, 1 );
	}

	public function Set ( isTicked : boolean ) : boolean {
		if ( !tickbox.CheckMouseOver() ) {
			tickbox.isTicked = isTicked;
		}

		return Out ();
	}

	public function Out () : boolean {
		return tickbox.isTicked;
	}
}

public class OESlider extends OEField {
	public var slider : OGSlider;
	public var title : OGLabel;

	private var min : float;
	private var max : float;
	private var val : float;
	
	private function CalcValue ( value : float ) : float {
		return Mathf.Round ( ( ( ( max - min ) * value ) + min ) * 100 ) / 100;
	}

	private function CalcValuePercent ( value : float ) : float {
		return ( value - min ) / ( max - min );
	}

	function OESlider ( parent : Transform ) {
		slider = new GameObject ( "sld_Slider" ).AddComponent.< OGSlider > ();
		title = new GameObject ( "lbl_Slider" ).AddComponent.< OGLabel > ();

		slider.transform.parent = parent;
		title.transform.parent = parent;
		
		slider.ApplyDefaultStyles ();
		title.ApplyDefaultStyles ();
	}

	override function Destroy () {
		MonoBehaviour.Destroy ( slider.gameObject );
		MonoBehaviour.Destroy ( title.gameObject );
	}

	override function Update ( text : String, pos : Vector2, scale : Vector2 ) {
		title.text = text + " (" + val + ")";
		
		title.tint.a = enabled ? 1.0 : 0.5;
		slider.tint.a = enabled ? 1.0 : 0.5;
		slider.isDisabled = !enabled;

		if ( !String.IsNullOrEmpty ( text ) ) {
			title.transform.localPosition = new Vector3 ( pos.x, pos.y, 0 );
			title.transform.localScale = new Vector3 ( scale.x / 2, scale.y, 1 );
			slider.transform.localPosition = new Vector3 ( pos.x + scale.x / 2, pos.y, 0 );
			slider.transform.localScale = new Vector3 ( scale.x / 2, scale.y, 1 );
		
		} else {
			slider.transform.localPosition = new Vector3 ( pos.x, pos.y, 0 );
			slider.transform.localScale = new Vector3 ( scale.x, scale.y, 1 );
		
		}
	}

	public function Set ( value : float, min : float, max : float ) : float {
		val = value;
		
		if ( canSet ) {
			this.min = min;
			this.max = max;

			slider.sliderValue = CalcValuePercent ( value );
		}

		setCounter = slider.CheckMouseOver () ? -1 : 0;

		return Out ();
	}

	public function Out () : float {
		return CalcValue ( slider.sliderValue );
	}	
}

public class OEFloatField extends OEField {
	public var textfield : OGTextField;
	public var title : OGLabel;

	function OEFloatField ( parent : Transform ) {
		textfield = new GameObject ( "fld_Float" ).AddComponent.< OGTextField > ();
		title = new GameObject ( "lbl_Float" ).AddComponent.< OGLabel > ();

		textfield.transform.parent = parent;
		title.transform.parent = parent;
		
		textfield.ApplyDefaultStyles ();
		title.ApplyDefaultStyles ();
	}

	override function Destroy () {
		MonoBehaviour.Destroy ( textfield.gameObject );
		MonoBehaviour.Destroy ( title.gameObject );
	}

	override function Update ( text : String, pos : Vector2, scale : Vector2 ) {
		title.text = text;
		
		title.tint.a = enabled ? 1.0 : 0.5;
		textfield.tint.a = enabled ? 1.0 : 0.5;
		textfield.isDisabled = !enabled;

		if ( !String.IsNullOrEmpty ( text ) ) {
			title.transform.localPosition = new Vector3 ( pos.x, pos.y, 0 );
			title.transform.localScale = new Vector3 ( scale.x / 2, scale.y, 1 );
			textfield.transform.localPosition = new Vector3 ( pos.x + scale.x / 2, pos.y, 0 );
			textfield.transform.localScale = new Vector3 ( scale.x / 2, scale.y, 1 );
		
		} else {
			textfield.transform.localPosition = new Vector3 ( pos.x, pos.y, 0 );
			textfield.transform.localScale = new Vector3 ( scale.x, scale.y, 1 );
		
		}
	}

	public function Set ( value : float ) : float {
		if ( !textfield.listening ) {
			textfield.text = value.ToString ();
		}

		return Out ();
	}

	public function Out () : float {
		var value : float;

		textfield.text = textfield.text.Replace ( "\n", "" );
		
		float.TryParse ( textfield.text, value );
		
		return value;
	}	
}

public class OEIntField extends OEField {
	public var textfield : OGTextField;
	public var title : OGLabel;

	function OEIntField ( parent : Transform ) {
		textfield = new GameObject ( "fld_Int" ).AddComponent.< OGTextField > ();
		title = new GameObject ( "lbl_Int" ).AddComponent.< OGLabel > ();

		textfield.transform.parent = parent;
		title.transform.parent = parent;
		
		textfield.ApplyDefaultStyles ();
		title.ApplyDefaultStyles ();
	}

	override function Destroy () {
		MonoBehaviour.Destroy ( textfield.gameObject );
		MonoBehaviour.Destroy ( title.gameObject );
	}

	override function Update ( text : String, pos : Vector2, scale : Vector2 ) {
		title.text = text;
		
		title.tint.a = enabled ? 1.0 : 0.5;
		textfield.tint.a = enabled ? 1.0 : 0.5;
		textfield.isDisabled = !enabled;

		if ( !String.IsNullOrEmpty ( text ) ) {
			title.transform.localPosition = new Vector3 ( pos.x, pos.y, 0 );
			title.transform.localScale = new Vector3 ( scale.x / 2, scale.y, 1 );
			textfield.transform.localPosition = new Vector3 ( pos.x + scale.x / 2, pos.y, 0 );
			textfield.transform.localScale = new Vector3 ( scale.x / 2, scale.y, 1 );
		
		} else {
			textfield.transform.localPosition = new Vector3 ( pos.x, pos.y, 0 );
			textfield.transform.localScale = new Vector3 ( scale.x, scale.y, 1 );
		
		}
	}

	public function Set ( value : int ) : int {
		if ( !textfield.listening ) {	
			textfield.text = value.ToString ();
		}

		return Out ();
	}

	public function Out () : int {
		var value : int;
		
		textfield.text = textfield.text.Replace ( "\n", "" );

		int.TryParse ( textfield.text, value );
		
		return value;
	}	
}

public class OETextField extends OEField {
	public var textfield : OGTextField;
	public var title : OGLabel;

	function OETextField ( parent : Transform ) {
		textfield = new GameObject ( "fld_Text" ).AddComponent.< OGTextField > ();
		title = new GameObject ( "lbl_Text" ).AddComponent.< OGLabel > ();

		textfield.transform.parent = parent;
		title.transform.parent = parent;
		
		textfield.ApplyDefaultStyles ();
		title.ApplyDefaultStyles ();
	}

	override function Destroy () {
		MonoBehaviour.Destroy ( textfield.gameObject );
		MonoBehaviour.Destroy ( title.gameObject );
	}

	override function Update ( text : String, pos : Vector2, scale : Vector2 ) {
		title.text = text;
		
		title.tint.a = enabled ? 1.0 : 0.5;
		textfield.tint.a = enabled ? 1.0 : 0.5;
		textfield.isDisabled = !enabled;

		if ( !String.IsNullOrEmpty ( text ) ) {
			title.transform.localPosition = new Vector3 ( pos.x, pos.y, 0 );
			title.transform.localScale = new Vector3 ( scale.x / 2, scale.y, 1 );
			textfield.transform.localPosition = new Vector3 ( pos.x + scale.x / 2, pos.y, 0 );
			textfield.transform.localScale = new Vector3 ( scale.x / 2, scale.y, 1 );
		
		} else {
			textfield.transform.localPosition = new Vector3 ( pos.x, pos.y, 0 );
			textfield.transform.localScale = new Vector3 ( scale.x, scale.y, 1 );
		
		}
	}


	public function Set ( string : String ) : String {
		if ( !textfield.listening ) {
			textfield.text = string;
		}
		
		return Out ();
	}

	public function Out () : String {
		if ( !String.IsNullOrEmpty ( textfield.text ) ) {
			textfield.text = textfield.text.Replace ( "\n", "" );
		}

		return textfield.text;
	}	
}

public class OEComponentInspector {
	public var width : float = 280;
	public var transform : Transform;
	@NonSerialized public var target : OFSerializedObject;
	@NonSerialized public var offset : Vector2;
	public var overrideTarget : boolean = false;

	private var fields : OEField[] = new OEField[900];
	private var fieldCounter : int = 0;
	private var disabled : boolean = false;

	public function get type () : System.Type { return null; }
	
	public function CheckType ( str : String ) {
		return type != null && type.ToString().Replace ( "UnityEngine.", "" ) == str;
	}

	public function Init ( obj : OFSerializedObject, t : Transform ) {
		target = obj;
		transform = t;
	}

	public function Inspector () {}
	public function DrawGL () {}

	// Clean up
	public function CleanUp () {
		for ( var i : int = fieldCounter; i < fields.Length; i++ ) {
			if ( fields[i] ) {
				fields[i].Destroy ();
				fields[i] = null;
			}
		}
	}

	public function Clear () {
		target = null;
		offset = Vector2.zero;
		fields = new OEField[900];
		fieldCounter = 0;
	}

	// Disable fields
	public function BeginDisabled ( b : boolean ) {
		disabled = b;
	}

	public function EndDisabled () {
		disabled = false;
	}

	private function CheckField ( type : System.Type ) : OEField {
		if ( fields [ fieldCounter ] ) {
			if ( fields [ fieldCounter ].GetType() != type ) {
				fields [ fieldCounter ].Destroy ();
				fields [ fieldCounter ] = OEField.New ( type, this.transform );
			}
		
		} else {
			fields [ fieldCounter ] = OEField.New ( type, this.transform );

		}
		
		return fields [ fieldCounter ];
	}

	// Space
	public function Offset ( x : float, y : float ) {
		offset.x += x;
		offset.y += y;
	}

	// OETexture
	public function Texture ( tex : Texture2D, rect : Rect ) {
		var texture : OETexture = CheckField ( typeof ( OETexture ) ) as OETexture;
		texture.texture.mainTexture = tex;
		texture.Update ( "", new Vector2 ( rect.x, rect.y ), new Vector2 ( rect.width, rect.height ) );
		texture.enabled = !disabled;
		fieldCounter++;
	}

	// OEAssetLinkField
	public function AssetLinkField ( text : String, linkName : String, target : OFSerializedObject, sysType : System.Type ) : Object {
		offset.y += 20;
		return AssetLinkField ( text, linkName, target, sysType, new Rect ( offset.x, offset.y, width - offset.x, 16 ) );
	}
	
	public function AssetLinkField ( text : String, linkName : String, target : OFSerializedObject, sysType : System.Type, strType : String ) : Object {
		offset.y += 20;
		return AssetLinkField ( text, linkName, target, sysType, strType, new Rect ( offset.x, offset.y, width - offset.x, 16 ) );
	}
	
	public function AssetLinkField ( text : String, linkName : String, target : OFSerializedObject, sysType : System.Type, rect : Rect ) : Object {
		return AssetLinkField ( text, linkName, target, sysType, "" );
	}
	
	public function AssetLinkField ( text : String, linkName : String, target : OFSerializedObject, sysType : System.Type, strType : String, rect : Rect ) : Object {
		var assetLinkField : OEAssetLinkField = CheckField ( typeof ( OEAssetLinkField ) ) as OEAssetLinkField;
		assetLinkField.Update ( text, new Vector2 ( rect.x, rect.y ), new Vector2 ( rect.width, rect.height ) );
		assetLinkField.enabled = !disabled;
		fieldCounter++;
		return assetLinkField.Set ( linkName, target, sysType, strType );
	}
	

	// OEObjectField
	public function ObjectField ( text : String, input : Object, sysType : System.Type, strType : String ) : Object {
		offset.y += 20;
		return ObjectField ( text, input, sysType, strType, null );
	}
	
	public function ObjectField ( text : String, input : Object, sysType : System.Type, strType : String, rect : Rect ) : Object {
		return ObjectField ( text, input, sysType, strType, null, rect );
	}

	public function ObjectField ( text : String, input : Object, sysType : System.Type, strType : String, attachTo : OFSerializedObject ) : Object {
		offset.y += 20;
		return ObjectField ( text, input, sysType, strType, attachTo, new Rect ( offset.x, offset.y, width - offset.x, 16 ) );
	}

	public function ObjectField ( text : String, input : Object, sysType : System.Type, strType : String, attachTo : OFSerializedObject, rect : Rect ) : Object {
		var objectField : OEObjectField = CheckField ( typeof ( OEObjectField ) ) as OEObjectField;
		objectField.Update ( text, new Vector2 ( rect.x, rect.y ), new Vector2 ( rect.width, rect.height ) );
		objectField.enabled = !disabled;
		fieldCounter++;
		return objectField.Set ( input, sysType, strType, attachTo );
	}
	
	public function ObjectField ( text : String, input : Object, type : System.Type, target : OEObjectField.Target ) : Object {
		offset.y += 20;
		return ObjectField ( text, input, type, target, new Rect ( offset.x, offset.y, width - offset.x, 16 ) );
	}

	public function ObjectField ( text : String, input : Object, type : System.Type, target : OEObjectField.Target, rect : Rect ) : Object {
		var objectField : OEObjectField = CheckField ( typeof ( OEObjectField ) ) as OEObjectField;
		objectField.Update ( text, new Vector2 ( rect.x, rect.y ), new Vector2 ( rect.width, rect.height ) );
		objectField.enabled = !disabled;
		fieldCounter++;
		return objectField.Set ( input, type, target );
	}
	
	// OEVector3Field
	public function Vector3Field ( text : String, input : Vector3 ) : Vector3 {
		offset.y += 20;
		return Vector3Field ( text, input, new Rect ( offset.x, offset.y, width - offset.x, 16 ) );
	}

	public function Vector3Field ( text : String, input : Vector3, rect : Rect ) : Vector3 {
		var vector3Field : OEVector3Field = CheckField ( typeof ( OEVector3Field ) ) as OEVector3Field;
		vector3Field.Update ( text, new Vector2 ( rect.x, rect.y ), new Vector2 ( rect.width, rect.height ) );
		vector3Field.enabled = !disabled;
		fieldCounter++;
		return vector3Field.Set ( input );
	}
	
	// OEColorField
	public function ColorField ( text : String, input : Color ) : Color {
		offset.y += 20;
		return ColorField ( text, input, new Rect ( offset.x, offset.y, width - offset.x, 16 ) );
	}

	public function ColorField ( text : String, input : Color, rect : Rect ) : Color {
		var colorField : OEColorField = CheckField ( typeof ( OEColorField ) ) as OEColorField;
		colorField.Update ( text, new Vector2 ( rect.x, rect.y ), new Vector2 ( rect.width, rect.height ) );
		colorField.enabled = !disabled;
		fieldCounter++;
		return colorField.Set ( input );
	}
	
	// OESlider
	public function Slider ( text : String, input : float, min : float, max : float ) : float {
		offset.y += 20;
		return Slider ( text, input, min, max, new Rect ( offset.x, offset.y, width - offset.x, 16 ) );
	}

	public function Slider ( text : String, input : float, min : float, max : float, rect : Rect ) : float {
		var slider : OESlider = CheckField ( typeof ( OESlider ) ) as OESlider;
		slider.Update ( text, new Vector2 ( rect.x, rect.y ), new Vector2 ( rect.width, rect.height ) );
		slider.enabled = !disabled;
		fieldCounter++;
		return slider.Set ( input, min, max );
	}
	
	// OELabelField
	public function LabelField ( text : String ) {
		offset.y += 20;
		LabelField ( text, new Rect ( offset.x, offset.y, width - offset.x, 16 ) );
	}

	public function LabelField ( text : String, rect : Rect ) {
		var labelField : OELabelField = CheckField ( typeof ( OELabelField ) ) as OELabelField;
		labelField.Update ( text, new Vector2 ( rect.x, rect.y ), new Vector2 ( rect.width, rect.height ) );
		labelField.enabled = !disabled;
		fieldCounter++;
	}

	// OETextField
	public function TextField ( text : String, input : String ) : String {
		offset.y += 20;
		return TextField ( text, input, new Rect ( offset.x, offset.y, width - offset.x, 16 ) );
	}

	public function TextField ( text : String, input : String, rect : Rect ) : String {
		var textField : OETextField = CheckField ( typeof ( OETextField ) ) as OETextField;
		textField.Update ( text, new Vector2 ( rect.x, rect.y ), new Vector2 ( rect.width, rect.height ) );
		textField.enabled = !disabled;
		fieldCounter++;
		return textField.Set ( input );
	}
	
	// OEIntField
	public function IntField ( text : String, input : int ) : int {
		offset.y += 20;
		return IntField ( text, input, new Rect ( offset.x, offset.y, width - offset.x, 16 ) );
	}

	public function IntField ( text : String, input : int, rect : Rect ) : int {
		var intField : OEIntField = CheckField ( typeof ( OEIntField ) ) as OEIntField;
		intField.Update ( text, new Vector2 ( rect.x, rect.y ), new Vector2 ( rect.width, rect.height ) );
		intField.enabled = !disabled;
		fieldCounter++;
		return intField.Set ( input );
	}

	// OEFloatField
	public function FloatField ( text : String, input : float ) : float {
		offset.y += 20;
		return FloatField ( text, input, new Rect ( offset.x, offset.y, width - offset.x, 16 ) );
	}

	public function FloatField ( text : String, input : float, rect : Rect ) : float {
		var floatField : OEFloatField = CheckField ( typeof ( OEFloatField ) ) as OEFloatField;
		floatField.Update ( text, new Vector2 ( rect.x, rect.y ), new Vector2 ( rect.width, rect.height ) );
		floatField.enabled = !disabled;
		fieldCounter++;
		return floatField.Set ( input );
	}

	// OEButton
	public function Button ( text : String ) : boolean {
		offset.y += 20;
		return Button ( text, new Rect ( offset.x, offset.y, width - offset.x, 16 ) );
	}

	public function Button ( text : String, rect : Rect ) : boolean {
		var button : OEButton = CheckField ( typeof ( OEButton ) ) as OEButton;
		button.Update ( text, new Vector2 ( rect.x, rect.y ), new Vector2 ( rect.width, rect.height ) );
		button.enabled = !disabled;
		fieldCounter++;
		return button.Set ();
	}

	// OEPopup
	public function Popup ( text : String, input : int, strings : String[] ) : int {
		offset.y += 20;
		return Popup ( text, input, strings, new Rect ( offset.x, offset.y, width - offset.x, 16 ) );
	}
	
	public function Popup ( text : String, input : int, strings : String[], rect : Rect ) : int {
		var popup : OEPopup = CheckField ( typeof ( OEPopup ) ) as OEPopup;
		popup.Update ( text, new Vector2 ( rect.x, rect.y ), new Vector2 ( rect.width, rect.height ) );
		popup.enabled = !disabled;
		fieldCounter++;
		return popup.Set ( input, strings );
	}

	// OEPointField
	public function PointField ( text : String, input : Vector3 ) : Vector3 {
		offset.y += 20;
		return PointField ( text, input, new Rect ( offset.x, offset.y, width - offset.x, 16 ) );
	}

	public function PointField ( text : String, input : Vector3, rect : Rect ) : Vector3 {
		var pointField : OEPointField = CheckField ( typeof ( OEPointField ) ) as OEPointField;
		pointField.Update ( text, new Vector2 ( rect.x, rect.y ), new Vector2 ( rect.width, rect.height ) );
		pointField.enabled = !disabled;
		fieldCounter++;
		return pointField.Set ( input );
	}
	
	// OEBox
	public function Box ( text : String ) {
		offset.y += 20;
		Box ( text, new Rect ( offset.x, offset.y, width - offset.x, 16 ) );
	}
	
	public function Box ( text : String, rect : Rect ) {
		var box : OEBox = CheckField ( typeof ( OEBox ) ) as OEBox;
		box.Update ( text, new Vector2 ( rect.x, rect.y ), new Vector2 ( rect.width, rect.height ) );
		fieldCounter++;
	}

	// OEToggle
	public function Toggle ( text : String, input : boolean ) : boolean {
		offset.y += 20;
		return Toggle ( text, input, new Rect ( offset.x, offset.y, width - offset.x, 16 ) );
	}
	
	public function Toggle ( text : String, input : boolean, rect : Rect ) : boolean {
		var toggle : OEToggle = CheckField ( typeof ( OEToggle ) ) as OEToggle;
		toggle.Update ( text, new Vector2 ( rect.x, rect.y ), new Vector2 ( rect.width, rect.height ) );
		toggle.enabled = !disabled;
		fieldCounter++;
		return toggle.Set ( input );
	}

	public function Update () {
		fieldCounter = 0;
		offset = new Vector2 ( 0, -20 );

       		if ( target || overrideTarget ) {
			Inspector ();
		}

		CleanUp ();
	}
}
