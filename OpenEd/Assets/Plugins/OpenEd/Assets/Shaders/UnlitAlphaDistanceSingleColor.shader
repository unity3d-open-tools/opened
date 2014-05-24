Shader "Unlit/Alpha Distance Single Color" {
	Properties {
		_Color ( "Color", Color ) = ( 1, 1, 1, 1 )
		_Distance ( "Distance", float ) = 25
		_Focus ( "Focus", Vector ) = ( 0, 0, 0 )
	}
	 
	SubShader {
		Lighting Off
		ZWrite Off
		ZTest Always
		Cull Off
		Blend SrcAlpha OneMinusSrcAlpha
		 
		Tags { "Queue" = "Transparent" }
		CGPROGRAM
		#pragma surface surf Lambert		

		uniform float4 _Color;
		uniform float _Distance;
		uniform float3 _Focus;

		struct Input {
			float4 color : COLOR;
			float3 worldPos;
		};	
		
		void surf ( Input IN, inout SurfaceOutput o ) {
			o.Albedo = _Color;
			o.Alpha = 1 - distance ( _Focus, IN.worldPos ) / _Distance;
		}
		ENDCG	
	}
	
	Fallback "Diffuse"
}
