using UnityEngine;
using System.Collections;

public class SerializeMyClass : OFPlugin {
	override public System.Type[] types {
		get { return new System.Type [] { typeof ( MyClass ) }; }
	}

	// Find the object by GUID after all objects have been instantiated
	private IEnumerator ConnectObject ( MyClass myClass, string id ) {
		yield return new WaitForEndOfFrame ();
		
		OFSerializedObject so = OFDeserializer.FindObject ( id );
		
		if ( so ) {
			myClass.myObject = so.gameObject;
		}
	}

	// Deserialize the class from JSON
	override public void Deserialize ( JSONObject input, Component output ) {
		MyClass myClass = output as MyClass;
	
		myClass.myInt = (int) input.GetField ( "myInt" ).n;
		myClass.myFloat = input.GetField ( "myFloat" ).n;
		myClass.myBool = input.GetField ( "myBool" ).b;
		myClass.myString = input.GetField ( "myString" ).str;
		OFDeserializer.planner.DeferConnection ( ConnectObject ( myClass, input.GetField ( "myObject" ).str ) );
	}
	
	// Serialize the class to JSON
	override public JSONObject Serialize ( Component input ) {
		JSONObject output = new JSONObject ( JSONObject.Type.OBJECT );
		MyClass myClass = input as MyClass;

		output.AddField ( "myInt", myClass.myInt );
		output.AddField ( "myFloat", myClass.myFloat );
		output.AddField ( "myBool", myClass.myBool );
		output.AddField ( "myObject", myClass.myObject.GetComponent < OFSerializedObject > ().id );
		output.AddField ( "myString", myClass.myString );

		return output;
	}
}
