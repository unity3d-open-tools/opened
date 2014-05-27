using UnityEngine;
using System.Collections;

public class MyClassInspector : OEComponentInspector {
	override public System.Type type {
		get { return typeof ( MyClass ); }
	}

	override public void Inspector () {
		MyClass myClass = target.GetComponent < MyClass > ();

		myClass.myInt = IntField ( "My int", myClass.myInt );
		myClass.myFloat = Slider ( "My float", myClass.myFloat, 0f, 10f );
		myClass.myString = TextField ( "My string", myClass.myString );
		myClass.myBool = Toggle ( "My bool", myClass.myBool );
		myClass.myObject = ObjectField ( "My object", myClass.myObject, typeof ( GameObject ), OEObjectField.Target.Scene ) as GameObject;
	}
}
