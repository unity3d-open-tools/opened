#pragma strict

public class OEAudioSourceInspector extends OEComponentInspector {
	private var audio : AudioSource;

	override function get type () : System.Type { return typeof ( AudioSource ); }
	
	override function Inspector () {
		if ( !audio ) {
		       audio = target.GetComponent.< AudioSource >();
		}

		audio.clip = AssetLinkField ( "Clip", "clip", target, typeof ( AudioClip ), "ogg" ) as AudioClip;
		
		offset.y += 20;
		
		audio.loop = Toggle ( "Loop", audio.loop );
		audio.playOnAwake = Toggle ( "Play on awake", audio.playOnAwake );
		audio.ignoreListenerPause = Toggle ( "Ignore pause", audio.ignoreListenerPause );
		audio.ignoreListenerVolume = Toggle ( "Ignore volume", audio.ignoreListenerVolume );

		offset.y += 20;

		audio.dopplerLevel = FloatField ( "Doppler level", audio.dopplerLevel );
		audio.minDistance = FloatField ( "Min distance", audio.minDistance );
		audio.maxDistance = FloatField ( "Max distance", audio.maxDistance );
		audio.panLevel = FloatField ( "Pan level", audio.panLevel );
		audio.spread = FloatField ( "Spread", audio.spread );
		
		offset.y += 20;
		
		audio.rolloffMode = Popup ( "Rolloff mode", audio.rolloffMode, System.Enum.GetNames ( AudioRolloffMode ) );
		
		offset.y += 20;
		
		audio.volume = Slider ( "Volume", audio.volume, 0, 1 );
		audio.pitch = Slider ( "Pitch", audio.pitch, -3, 3 );
		audio.priority = Slider ( "Priority", audio.priority, 0, 255 );

		offset.y += 20;

		if ( audio.isPlaying ) {
			if ( Button ( "Stop" ) ) {
				audio.Stop ();
			}
		
		} else {
			if ( Button ( "Play" ) ) {
				audio.Play ();
			}

		}
	}

	override function DrawGL () {
		if ( audio ) {
			GL.Begin ( GL.LINES );
			
			OEWorkspace.GetInstance().cam.materials.highlight.SetPass ( 0 );
			
			var degRad = Mathf.PI / 180;
			var center : Vector3 = audio.transform.position;
			var radius : float = audio.maxDistance;
			var nextVector : Vector3;

			for ( var theta : float = 0; theta < ( 2 * Mathf.PI ); theta += 0.01 ) {
				nextVector = new Vector3 ( Mathf.Cos ( theta ) * radius + center.x, Mathf.Sin ( theta ) * radius + center.y, center.z );
				GL.Vertex ( nextVector );
			}

			GL.Vertex ( nextVector );
			
			for ( theta = 0; theta < ( 2 * Mathf.PI ); theta += 0.01 ) {
				nextVector = new Vector3 ( center.x, Mathf.Sin ( theta ) * radius + center.y, Mathf.Cos ( theta ) * radius + center.z );
				GL.Vertex ( nextVector );
			}
			
			for ( theta = 0; theta < ( 2 * Mathf.PI ); theta += 0.01 ) {
				nextVector = new Vector3 ( Mathf.Sin ( theta ) * radius + center.x, center.y, Mathf.Cos ( theta ) * radius + center.z );
				GL.Vertex ( nextVector );
			}

			GL.End ();
		}
	}
}
