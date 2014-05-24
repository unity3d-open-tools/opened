Shader "Unlit/Single Color" {
	Properties {
		_Color ("Color", Color) = (1,1,1,1)
	}
	 
	Category {
		Lighting Off
		ZWrite Off
		Cull Off
		Blend SrcAlpha OneMinusSrcAlpha
		Tags {"Queue"="Transparent"}
		 
		SubShader {
			Color [_Color]
			
			Pass {							
			}
		}
		
		Fallback "Diffuse"
	}
}
