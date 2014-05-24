#pragma strict

public class OEReflector {
	private static function CheckAssembly ( assembly : System.Reflection.Assembly ) : boolean {
		if ( assembly.FullName.StartsWith ( "Mono.Cecil" ) ) {
			return false;
    
		} else if ( assembly.FullName.StartsWith ( "UnityScript" ) ) {
			return false;

		} else if ( assembly.FullName.StartsWith ( "Boo.Lan" ) ) {
			return false;

		} else if ( assembly.FullName.StartsWith ( "System" ) ) {
			return false;

		} else if ( assembly.FullName.StartsWith ( "I18N" ) ) {
			return false;

		} else if ( assembly.FullName.StartsWith ( "UnityEngine" ) ) {
			return false;

		} else if ( assembly.FullName.StartsWith ( "UnityEditor" ) ) {
			return false;

		} else if ( assembly.FullName.StartsWith ( "mscorlib" ) ) {
			return false;
	    
		} else {
			return true;

		}
	}
	
	private static function CheckType ( type : System.Type ) : boolean {
		if ( !type.IsClass ) {
			return false;

		} else if ( type.IsAbstract ) {
			return false;

		} else if ( !type.IsSubclassOf ( typeof ( OEComponentInspector ) ) ) {
			return false;
		
		} else {
			return true;
		
		}
	}

	public static function GetInspectors () : OEComponentInspector [] {
		var inspectors : List.< OEComponentInspector > = new List.< OEComponentInspector > ();

		for ( var assembly : System.Reflection.Assembly in AppDomain.CurrentDomain.GetAssemblies () ) {
	
			if ( !CheckAssembly ( assembly ) ) { continue; }

		    	for ( var type : System.Type in assembly.GetTypes () ) {
			
				if ( !CheckType ( type ) ) { continue; }
				
				inspectors.Add ( System.Activator.CreateInstance ( type ) as OEComponentInspector );
			} 
		}

		return inspectors.ToArray ();
	}
}
