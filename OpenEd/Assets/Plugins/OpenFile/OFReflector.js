#pragma strict

public class OFReflector {
	public static function GetPlugins () : OFPlugin [] {
		var types : List.< OFPlugin > = new List.< OFPlugin > ();

		for ( var assembly : System.Reflection.Assembly in AppDomain.CurrentDomain.GetAssemblies () ) {
			if ( assembly.FullName.StartsWith ( "Mono.Cecil" ) ) {
				continue;
	    
		    	} else if ( assembly.FullName.StartsWith ( "UnityScript" ) ) {
				continue;

		   	} else if ( assembly.FullName.StartsWith ( "Boo.Lan" ) ) {
				continue;

		    	} else if ( assembly.FullName.StartsWith ( "System" ) ) {
				continue;

		    	} else if ( assembly.FullName.StartsWith ( "I18N" ) ) {
				continue;

		    	} else if ( assembly.FullName.StartsWith ( "UnityEngine" ) ) {
				continue;

		   	} else if ( assembly.FullName.StartsWith ( "UnityEditor" ) ) {
				continue;

		    	} else if ( assembly.FullName.StartsWith ( "mscorlib" ) ) {
				continue;
		    
		    	}
	 
		    	for ( var type : System.Type in assembly.GetTypes () ) {
				if ( !type.IsClass ) {
			    		continue;

				} else if ( type.IsAbstract ) {
			    		continue;

				} else if ( !type.IsSubclassOf ( typeof ( OFPlugin ) ) ) {
			    		continue;
				
				}
				
				types.Add ( System.Activator.CreateInstance ( type ) as OFPlugin );
			} 
		}

		return types.ToArray ();
	}
}
