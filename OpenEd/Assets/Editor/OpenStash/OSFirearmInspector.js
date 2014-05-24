#pragma strict

import System.Collections.Generic;

@CustomEditor ( OSFirearm )
public class OSFirearmInspector extends Editor {
	override function OnInspectorGUI () {
		var firearm : OSFirearm = target as OSFirearm;

		if ( !firearm.item ) {
			firearm.item = firearm.GetComponent.< OSItem > ();

			GUI.color = Color.red;
			EditorGUILayout.LabelField ( "There is no OSItem component on this object!", EditorStyles.boldLabel );
			GUI.color = Color.white;
			return;
		}
		
		EditorGUILayout.LabelField ( "Properties", EditorStyles.boldLabel );

		DrawDefaultInspector ();

		EditorGUILayout.Space ();

		EditorGUILayout.LabelField ( "Inherited attributes", EditorStyles.boldLabel );

		firearm.accuracyIndex = EditorGUILayout.Popup ( "Accuracy", firearm.accuracyIndex, firearm.item.GetAttributeStrings () );
		firearm.damageIndex = EditorGUILayout.Popup ( "Damage", firearm.damageIndex, firearm.item.GetAttributeStrings () );
		firearm.firingRateIndex = EditorGUILayout.Popup ( "Firing rate", firearm.firingRateIndex, firearm.item.GetAttributeStrings () );
		firearm.rangeIndex = EditorGUILayout.Popup ( "Range", firearm.rangeIndex, firearm.item.GetAttributeStrings () );
		firearm.reloadSpeedIndex = EditorGUILayout.Popup ( "Reload speed", firearm.reloadSpeedIndex, firearm.item.GetAttributeStrings () );

		EditorGUILayout.Space ();

		EditorGUILayout.LabelField ( "Inherited sounds", EditorStyles.boldLabel );

		firearm.firingSoundIndex = EditorGUILayout.Popup ( "Fire", firearm.firingSoundIndex, firearm.item.GetSoundStrings () );
		firearm.reloadSoundIndex = EditorGUILayout.Popup ( "Reload", firearm.reloadSoundIndex, firearm.item.GetSoundStrings () );
		firearm.equippingSoundIndex = EditorGUILayout.Popup ( "Equip", firearm.equippingSoundIndex, firearm.item.GetSoundStrings () );
		firearm.holsteringSoundIndex = EditorGUILayout.Popup ( "Holster", firearm.holsteringSoundIndex, firearm.item.GetSoundStrings () );
	}
}
