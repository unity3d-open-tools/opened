#pragma strict

import System.IO;

public class OFReader {
	public static function LoadFile ( path : String ) : JSONObject {
		path = path.Replace ( "\\", "/" ).Replace ( Application.dataPath, "" );

		#if UNITY_WEBPLAYER && !UNITY_EDITOR
			return OFWeb.Get ( path );
		#else			
			if ( !File.Exists ( Application.dataPath + path ) ) {
				Debug.LogError ( "OFReader | No such file '" + Application.dataPath + path + "'" );
				return null;
			}
			
			var sr : StreamReader = new File.OpenText ( Application.dataPath + path );
			var input : String = "";
			var line : String = "";
			
			line = sr.ReadLine();
			
			while ( line != null ) {
				input += line;
				line = sr.ReadLine();
			}
		
			sr.Close();
		
			return new JSONObject ( input, -2, false, false );
		#endif
	}
}
