#pragma strict

import System.Collections.Generic;

public class OCFlag {
	public var id : String;
	public var b : boolean;

	function OCFlag ( id : String, b : boolean ) {
		this.id = id;
		this.b = b;
	}
}

public class OCFlags {
	private var flags : List.< OCFlag > = List.< OCFlag > ();

	public function Clear () {
		flags.Clear ();
	}

	public function Set ( id : String, b : boolean ) {
		for ( var i : int = 0; i < flags.Count; i++ ) {
			if ( flags[i].id == id ) {
				flags[i].b = b;
				return;
			}
		}

		flags.Add ( new OCFlag ( id, b ) );
	}

	public function Get ( id : String ) : boolean {
		for ( var i : int = 0; i < flags.Count; i++ ) {
			if ( flags[i].id == id ) {
				return flags[i].b;
			}
		}

		return false;
	}
}
