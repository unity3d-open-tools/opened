#pragma strict

public class OSAmmunitionAmount {
	public var enabled : boolean = false;
	public var index : int = 0;
	public var value : int = 0;
	public var item : OSItem;

	function OSAmmunitionAmount ( item : OSItem ) {
		this.item = item;
	}

	public function get name () : String {
		return item.definitions.ammunitions[index].name;
	}
	
	public function get image () : Texture2D {
		return item.definitions.ammunitions[index].image;
	}
	
	public function get projectile () : OSProjectile {
		return item.definitions.ammunitions[index].projectile;
	}
}

public class OSAttribute {
	public var index : int = 0;
	public var value : float = 0;
	public var item : OSItem;

	function OSAttribute ( item : OSItem ) {
		this.item = item;
	}

	public function get id () : String {
		return item.definitions.attributes[index].id;
	}

	public function get name () : String {
		return item.definitions.attributes[index].name;
	}
	
	public function get suffix () : String {
		return item.definitions.attributes[index].suffix;
	}
}

public class OSItem extends MonoBehaviour {
	public var id : String = "New Item";
	public var description : String = "This is a new item";
	public var stackable : boolean = false;
	public var canDrop : boolean = true;
	public var catIndex : int;
	public var subcatIndex : int;
	public var slotSize : OSPoint = new OSPoint ( 1, 1 );
	public var attributes : OSAttribute[] = new OSAttribute[0];
	public var ammunition : OSAmmunitionAmount = new OSAmmunitionAmount ( this ); 
	public var thumbnail : Texture2D;
	public var preview : Texture2D;
	public var prefabPath : String;
	public var definitions : OSDefinitions;
	public var sounds : AudioClip[] = new AudioClip [0];

	public function get category () : String {
		return definitions.categories [ catIndex ].id;
	}
	
	public function get subcategory () : String {
		return definitions.categories [ catIndex ].subcategories [ subcatIndex ];
	}

	public function GetSound ( id : String ) : AudioClip {
		for ( var i : int = 0; i < sounds.Length; i++ ) {
			if ( sounds[i] && sounds[i].name == id ) {
				return sounds[i];
			}
		}

		return null;
	}
	
	public function GetSoundStrings () : String[] {
		var output : String [] = new String [ sounds.Length ];
		
		for ( var i : int = 0; i < sounds.Length; i++ ) {
			output[i] = ( sounds[i] == null ) ? "(none)" : sounds[i].name;
		}

		return output;
	}

	public function PlaySound ( id : String ) {
		if ( !audio ) {
			this.gameObject.AddComponent.< AudioSource > ();
		}

		audio.clip = GetSound ( id );
	}

	public function PlaySound ( index : int ) {
		if ( !audio ) {
			this.gameObject.AddComponent.< AudioSource > ();
		}

		audio.clip = sounds[index];
		audio.Play ();
	}

	public function ChangeAmmunition ( value : int ) {
		ammunition.value += value;
	}

	public function SetAmunition ( value : int ) {
		ammunition.value = value;
	}

	public function GetAttribute ( id : String ) : float {
		for ( var i : int = 0; i < attributes.Length; i++ ) {
			if ( attributes[i].id == id ) {
				return attributes[i].value;
			}
		}

		return -1;
	}
	
	public function GetAttributeStrings () : String [] {
		var output : String [] = new String [ attributes.Length ];

		for ( var i : int = 0; i < attributes.Length; i++ ) {
			output[i] = attributes[i].id; 
		}

		return output;
	}

	public function AdoptValues ( item : OSItem ) {
		this.ammunition.value = item.ammunition.value;

		for ( var i : int = 0; i < item.attributes.Length; i++ ) {
			this.attributes[i].value = item.attributes[i].value;
		}
	}

	public static function ConvertFromScene ( item : OSItem ) {
		return Resources.Load ( item.prefabPath );
	}
}
