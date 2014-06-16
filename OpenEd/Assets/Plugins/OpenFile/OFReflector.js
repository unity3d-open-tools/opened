#pragma strict

import System;

public class OFReflector {
	private static var plugins : OFPlugin [];
	
	public static function GetPlugin ( type : System.Type ) : OFPlugin {
		if ( !plugins ) {
			plugins = GetPlugins ();
		}
		
		for ( var i : int = 0; i < plugins.Length; i++ ) {
			if ( plugins[i].CheckType ( type ) ) {
				return plugins[i];
			}
		}

		return null;
	}

	public static function GetPlugins () : OFPlugin [] {
		if ( !plugins ) {
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

			plugins = types.ToArray ();
		}

		return plugins;
	}
}
