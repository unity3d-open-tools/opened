#pragma strict

public class OEAudioSourceInspector extends OEComponentInspector {
	override function get type () : System.Type { return typeof ( AudioSource ); }
	
	override function Inspector () {
		var audio : AudioSource = target.GetComponent.< AudioSource >();

		audio.clip = ObjectField ( "Clip", audio.clip, typeof ( AudioClip ), OEObjectField.Target.Asset ) as AudioClip;
		audio.dopplerLevel = FloatField ( "Doppler level", audio.dopplerLevel );
		audio.ignoreListenerPause = Toggle ( "Ignore pause", audio.ignoreListenerPause );
		audio.ignoreListenerVolume = Toggle ( "Ignore volume", audio.ignoreListenerVolume );
		audio.loop = Toggle ( "Loop", audio.loop );
		audio.maxDistance = FloatField ( "Max distance", audio.maxDistance );
		audio.minDistance = FloatField ( "Min distance", audio.minDistance );
		audio.panLevel = FloatField ( "Pan level", audio.panLevel );
		audio.pitch = Slider ( "Pitch", audio.pitch, -3, 3 );
		audio.playOnAwake = Toggle ( "Play on awake", audio.playOnAwake );
		audio.priority = Slider ( "Priority", audio.priority, 0, 255 );
		audio.rolloffMode = Popup ( "Rolloff mode", audio.rolloffMode, System.Enum.GetNames ( AudioRolloffMode ) );
		audio.spread = FloatField ( "Spread", audio.spread );
		audio.volume = Slider ( "Volume", audio.volume, 0, 1 );
	}	
}
