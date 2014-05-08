#pragma strict

public class OEField {
	public var timer : float = 0;
	public var enabled : boolean = true;

	public function get canSet () : boolean {
		if ( timer <= 0 ) {
			timer = 0.5;
			return true;
		
		} else {
			timer -= Time.deltaTime;
			return false;
		
		}
	}
}

public class OEVector3Field extends OEField {
	public var x : OGTextField;
	public var y : OGTextField;
	public var z : OGTextField;

	public function get listening () : boolean {
		return x.listening || y.listening || z.listening;
	}

	public function Set ( v : Vector3 ) : Vector3 {
		x.isDisabled = !enabled;
		y.isDisabled = !enabled;
		z.isDisabled = !enabled;
		
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

	public function get listening () : boolean {
		return r.listening || g.listening || b.listening || a.listening;
	}

	public function Set ( c : Color ) : Color {
		r.isDisabled = !enabled;
		g.isDisabled = !enabled;
		b.isDisabled = !enabled;
		a.isDisabled = !enabled;
		
		if ( canSet && !listening ) {
			r.text = ( Mathf.Round ( c.r * 1000 ) / 1000 ).ToString();
			g.text = ( Mathf.Round ( c.g * 1000 ) / 1000 ).ToString();
			b.text = ( Mathf.Round ( c.b * 1000 ) / 1000 ).ToString();
			a.text = ( Mathf.Round ( c.a * 1000 ) / 1000 ).ToString();
		}

		return Out ();
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

public class OEObjectField extends OEField {
	public var button : OGButton;

	private var obj : Object;

	public function Clear () {
		obj = null;
		timer = 0;
	}

	public function Set ( setObj : Object, sysType : System.Type, strType : String ) : Object {
		Set ( setObj, sysType, strType, null );
	}

	public function Set ( setObj : Object, sysType : System.Type, strType : String, attachTo : OFSerializedObject ) : Object {
		button.isDisabled = !enabled;
		
		if ( canSet ) {
			obj = setObj;
			
			button.func = function () {
				OEWorkspace.GetInstance().PickFile ( function ( file : System.IO.FileInfo ) {
					var json : JSONObject = OFReader.LoadFile ( file.FullName );
					var so : OFSerializedObject = OFDeserializer.Deserialize ( json, attachTo );
					obj = so.GetComponent ( sysType );
				}, strType );
			};
		}

		return Out ();
	}

	public function Set ( setObj : Object, sysType : System.Type, allowSceneObjects : boolean) : Object {
		button.isDisabled = !enabled;
		
		if ( canSet ) {
			obj = setObj;
			
			button.func = function () {
				if ( allowSceneObjects ) {		
					OEWorkspace.GetInstance().PickObject ( function ( picked : Object ) {
						obj = picked;
					}, sysType );
				
				} else {
					OEWorkspace.GetInstance().PickPrefab ( function ( picked : Object ) {
						obj = picked;
					}, sysType );
				}
			};
		}

		return Out ();
	}

	public function Out () : Object {
		var go : GameObject;
		
		if ( obj ) {
			var c : Component = obj as Component;

			if ( c ) {
				go = c.gameObject;
			} else {
				go = obj as GameObject;
			}

		}

		if ( go ) {
			button.text = go.name;
		
		} else {
			button.text = "None";

		}
		
		return obj;
	}
}

public class OELabelField extends OEField {
	public var label : OGLabel;

	public function Set ( text : String ) {
		label.isDisabled = !enabled;

		label.text = text;
	}
}

public class OEPopup extends OEField {
	public var popup : OGPopUp;

	public function Set ( selected : int, strings : String [] ) : int {
		popup.isDisabled = !enabled;

		if ( canSet ) {
			popup.options = strings;
			if ( strings.Length > 0 ) {
				popup.selectedOption = strings[selected];
			} else {
				popup.selectedOption = "";
			}
		}

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

	public function Set ( isTicked : boolean ) : boolean {
		tickbox.isDisabled = !enabled;
		
		if ( canSet ) {
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

	private var min : float;
	private var max : float;
	
	private function CalcValue ( value : float ) : float {
		return ( ( max - min ) * value ) + min;
	}

	private function CalcValuePercent ( value : float ) : float {
		return ( value - min ) / ( max - min );
	}

	public function Set ( value : float, min : float, max : float ) : float {
		slider.isDisabled = !enabled;

		if ( canSet ) {
			this.min = min;
			this.max = max;

			slider.sliderValue = CalcValuePercent ( value );
		}

		return Out ();
	}

	public function Out () : float {
		return CalcValue ( slider.sliderValue );
	}	
}

public class OEFloatField extends OEField {
	public var textfield : OGTextField;

	public function Set ( value : float ) : float {
		textfield.isDisabled = !enabled;
		
		if ( canSet ) {
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

	public function Set ( value : int ) : int {
		textfield.isDisabled = !enabled;
		
		if ( canSet ) {	
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

	public function Set ( string : String ) : String {
		textfield.isDisabled = !enabled;
		
		if ( canSet || textfield.listening ) {
			textfield.text = string;
		}

		return Out ();
	}

	public function Out () : String {
		textfield.text = textfield.text.Replace ( "\n", "" );
		
		return textfield.text;
	}	
}

public class OEComponentInspector extends MonoBehaviour {
	public var type : OFFieldType;
	@HideInInspector public var target : OFSerializedObject;

	public function get typeId () : String {
		return type.ToString();
	}

	public function Out () {}
	
	public function In () {}

	public function Init ( obj : OFSerializedObject ) {
		target = obj;
		In ();
	}
	
	public function Update () {
       		if ( target ) {
			Out ();
		}
	}
}
