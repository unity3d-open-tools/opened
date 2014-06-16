#pragma strict

public class OECamera extends MonoBehaviour {
	private class Materials {
		public var grid : Material;
		public var selection : Material;
		public var cursor : Material;
		public var light : Material;
		public var audioSource : Material;
		public var highlight : Material;
		public var navmesh : Material;
	}
	
	public var rotateSensitivity : Vector2 = new Vector2 ( 5, 5 );
	public var panSensitivity : Vector2 = new Vector2 ( 0.2, 0.2 );
	public var materials : Materials;
	public var lights : Light [] = new Light [0];
	public var audioSources : AudioSource [] = new AudioSource [0];
	public var wireframe : boolean = false;
	public var showGizmos : boolean = true;
	public var defaultAmbientLight : Color = new Color ( 0.2, 0.2, 0.2, 1.0 );
	public var dynamicLights : boolean = false;
	public var nearClipSlider : OGSlider;
	public var flyMode : boolean = false;
	
	@NonSerialized public var currentInspector : OEComponentInspector;

	private function CombineBounds ( colliders : Collider [] ) : Bounds {
		var bounds : Bounds;

		if ( colliders.Length > 0 ) {
			bounds = colliders[0].bounds;
			
			for ( var i : int = 0; i < colliders.Length; i++ ) {
				if ( colliders[i].bounds.min.x < bounds.min.x ) { bounds.min.x = colliders[i].bounds.min.x; }
				if ( colliders[i].bounds.min.y < bounds.min.y ) { bounds.min.y = colliders[i].bounds.min.y; }
				if ( colliders[i].bounds.min.z < bounds.min.z ) { bounds.min.z = colliders[i].bounds.min.z; }
				
				if ( colliders[i].bounds.max.x > bounds.max.x ) { bounds.max.x = colliders[i].bounds.max.x; }
				if ( colliders[i].bounds.max.y > bounds.max.y ) { bounds.max.y = colliders[i].bounds.max.y; }
				if ( colliders[i].bounds.max.z > bounds.max.z ) { bounds.max.z = colliders[i].bounds.max.z; }
			}
		}

		return bounds;
	}

	private function DrawGrid () {
		var focus : Vector3 = OEWorkspace.GetInstance().GetFocus ();
		var distance : int = 100;

		GL.Begin ( GL.LINES );

		materials.grid.SetPass ( 0 );		

		for ( var z : int = -distance; z < distance; z++ ) {
			GL.Vertex ( new Vector3 ( -distance, 0, z ) );
			GL.Vertex ( new Vector3 ( distance, 0, z ) );
		}
		
		for ( var x : int = -distance; x < distance; x++ ) {
			GL.Vertex ( new Vector3 ( x, 0, -distance ) );
			GL.Vertex ( new Vector3 ( x, 0, distance ) );
		}

		GL.End ();
	}

	private function DrawSelection () {
		GL.Begin ( GL.QUADS );

		materials.selection.SetPass ( 0 );

		for ( var i : int = 0; i < OEWorkspace.GetInstance().selection.Count; i++ ) {
			var go : GameObject = OEWorkspace.GetInstance().selection[i].gameObject;
			var b : Bounds = CombineBounds ( go.GetComponentsInChildren.< Collider > () );

			if ( b.size != Vector3.zero ) {
				var bbl : Vector3 = b.min;
				var btl : Vector3 = bbl + Vector3.up * b.size.y;
				var btr : Vector3 = btl + Vector3.right * b.size.x;
				var bbr : Vector3 = btr - Vector3.up * b.size.y;
				var fbl : Vector3 = bbl + Vector3.forward * b.size.z;
				var ftl : Vector3 = fbl + Vector3.up * b.size.y;
				var ftr : Vector3 = ftl + Vector3.right * b.size.x;
				var fbr : Vector3 = ftr - Vector3.up * b.size.y;

				GL.Vertex ( bbl );
				GL.Vertex ( btl );
				GL.Vertex ( btr );
				GL.Vertex ( bbr );
				
				GL.Vertex ( fbl );
				GL.Vertex ( ftl );
				GL.Vertex ( btl );
				GL.Vertex ( bbl );
				
				GL.Vertex ( fbl );
				GL.Vertex ( ftl );
				GL.Vertex ( ftr );
				GL.Vertex ( fbr );
				
				GL.Vertex ( fbr );
				GL.Vertex ( ftr );
				GL.Vertex ( btr );
				GL.Vertex ( bbr );
				
				GL.Vertex ( btl );
				GL.Vertex ( ftl );
				GL.Vertex ( ftr );
				GL.Vertex ( btr );
				
				GL.Vertex ( bbl );
				GL.Vertex ( fbl );
				GL.Vertex ( fbr );
				GL.Vertex ( bbr );
				
				//var matrix : Matrix4x4 = Matrix4x4.TRS ( go.transform.position, go.transform.rotation, go.transform.lossyScale );
				//for ( var t : int = 0; t < mesh.triangles.Length; t++ ) {
				//	GL.Vertex ( matrix.MultiplyPoint3x4 ( mesh.vertices[mesh.triangles[t]] ) );
				//}
			}
		}

		GL.End ();
	}

	private function DrawCursor () {
		var point : Vector3 = OEWorkspace.GetInstance().GetFocus ();
		var size : float = Vector3.Distance ( this.transform.position, point ) * 0.01;

		GL.Begin ( GL.LINES );

		materials.cursor.SetPass ( 0 );

		GL.Vertex ( point - this.transform.up * size );
		GL.Vertex ( point + this.transform.up * size );

		GL.Vertex ( point - this.transform.right * size );
		GL.Vertex ( point + this.transform.right * size );
		
		GL.End ();
	}
	
	private function DrawAudioSources () {
		GL.Begin ( GL.QUADS );
		materials.audioSource.SetPass ( 0 );
		
		for ( var i : int = 0; i < audioSources.Length; i++ ) {
			if ( audioSources[i] ) {
				var t : Transform = audioSources[i].transform;
				var right : Vector3 = this.transform.right * 0.25;
				var left : Vector3  = -right;
				var up : Vector3 = this.transform.up * 0.25;
				var down : Vector3 = -up;

				if ( t != this.transform ) {
					GL.TexCoord2 ( 0, 0 );
					GL.Vertex ( t.position + left + down );
					GL.TexCoord2 ( 0, 1 );
					GL.Vertex ( t.position + left + up );
					GL.TexCoord2 ( 1, 1 );
					GL.Vertex ( t.position + right + up );
					GL.TexCoord2 ( 1, 0 );
					GL.Vertex ( t.position + right + down );
				}
			}
		}

		GL.End ();
	}

	private function DrawLights () {
		GL.Begin ( GL.QUADS );
		materials.light.SetPass ( 0 );
		
		for ( var i : int = 0; i < lights.Length; i++ ) {
			if ( lights[i] ) {
				var t : Transform = lights[i].transform;
				var right : Vector3 = this.transform.right * 0.25;
				var left : Vector3  = -right;
				var up : Vector3 = this.transform.up * 0.25;
				var down : Vector3 = -up;

				if ( t != this.transform ) {
					GL.Color ( lights[i].color );
					
					GL.TexCoord2 ( 0, 0 );
					GL.Vertex ( t.position + left + down );
					GL.TexCoord2 ( 0, 1 );
					GL.Vertex ( t.position + left + up );
					GL.TexCoord2 ( 1, 1 );
					GL.Vertex ( t.position + right + up );
					GL.TexCoord2 ( 1, 0 );
					GL.Vertex ( t.position + right + down );

					GL.Color ( Color.white );
				}
			}
		}

		GL.End ();
	}

	public function OnPreRender () {
		GL.wireframe = wireframe;
	}

	public function OnPostRender () {
		GL.wireframe = false;
		
		GL.PushMatrix ();
		
		DrawCursor ();

		if ( materials.grid ) {
			DrawGrid ();
		}

		if ( materials.selection && OEWorkspace.GetInstance().selection.Count > 0 ) {
			DrawSelection ();
			
			if ( currentInspector && currentInspector.target ) {
				currentInspector.DrawGL ();
			}
		}

		if ( showGizmos ) {
		       	if ( lights.Length > 0 ) {
				DrawLights ();
			}
				
			if ( audioSources.Length > 0 ) {
				DrawAudioSources ();
			}
		}

		GL.PopMatrix ();
	}

	public function Update () {
		if ( OGRoot.GetInstance() && OGRoot.GetInstance().currentPage.name == "Home" ) {
			var focus : Vector3 = OEWorkspace.GetInstance().GetFocus ();
			
			if ( flyMode ) {
				var dx : float = Input.GetAxis ( "Mouse X" ) * rotateSensitivity.x;
				var dy : float = Input.GetAxis ( "Mouse Y" ) * rotateSensitivity.y;

				var newRot : Vector3 = this.transform.localEulerAngles;
				newRot.y += dx / 2;
				newRot.x -= dy / 2;

				var newPos : Vector3 = this.transform.position;

				newPos += this.transform.forward * Input.GetAxis ( "Vertical" ) * panSensitivity.y;
				newPos += this.transform.right * Input.GetAxis ( "Horizontal" ) * panSensitivity.x;
				
				if ( Input.GetKey ( KeyCode.Space ) ) {
					newPos += Vector3.up * panSensitivity.y;
				
				} else if ( Input.GetKey ( KeyCode.LeftControl ) ) {
					newPos -= Vector3.up * panSensitivity.y;
				
				}

				this.transform.localRotation = Quaternion.Euler ( newRot );
				this.transform.position = newPos;


			} else {
				// Selection & focus
				if ( !OGRoot.GetInstance().isMouseOver ) {
					var ray : Ray = this.camera.ScreenPointToRay ( Input.mousePosition );
						
					if ( Input.GetMouseButtonDown ( 1 ) || Input.GetMouseButtonDown ( 0 ) && Input.GetKey ( KeyCode.LeftAlt ) ) {
						var hit : RaycastHit;
						
						if ( Physics.Raycast ( ray, hit, Mathf.Infinity ) ) {
							OEWorkspace.GetInstance().SetFocus ( hit.point );
						}
					
					} else if ( Input.GetMouseButtonDown ( 0 ) ) {
						var hits : RaycastHit[] = Physics.RaycastAll ( ray, Mathf.Infinity );
					
						if ( hits.Length < 1 ) {
							OEWorkspace.GetInstance().ClearSelection ();
							return;
						}

						var obj : OFSerializedObject;
						var closest : float;
						
						for ( var i : int = 0; i < hits.Length; i++ ) {
							var axis : OEGizmoAxis = hits[i].collider.gameObject.GetComponent.< OEGizmoAxis> (); 
							var hitObj = hits[i].collider.gameObject.GetComponent.< OFSerializedObject > ();

							if ( axis ) {	
								axis.OnMouseDown ();
								return;
							
							} else if ( hitObj && obj == null || Vector3.Distance ( this.transform.position, hits[i].point ) < closest ) {
								obj = hitObj;
								closest = Vector3.Distance ( this.transform.position, hits[i].point );
							
							}
						}
						
						if ( obj ) {
							OEWorkspace.GetInstance().SelectObject ( obj );
						}
					}		
				}

				// Pan
				if ( Input.GetMouseButton ( 2 ) || Input.GetMouseButton ( 0 ) && Input.GetKey ( KeyCode.LeftAlt ) && Input.GetKey ( KeyCode.LeftShift ) ) {
					dx = Input.GetAxis ( "Mouse X" ) * panSensitivity.x;
					dy = Input.GetAxis ( "Mouse Y" ) * panSensitivity.y;

					transform.position -= transform.right * dx + transform.up * dy;

				// Rotate
				} else if ( Input.GetMouseButton ( 1 ) || Input.GetMouseButton ( 0 ) && Input.GetKey ( KeyCode.LeftAlt ) ) {
					var target : Vector3 = OEWorkspace.GetInstance().GetFocus ();	
					dx = Input.GetAxis ( "Mouse X" ) * rotateSensitivity.x;
					dy = Input.GetAxis ( "Mouse Y" ) * rotateSensitivity.y;

					transform.RotateAround ( target, Quaternion.Euler ( 0, -45, 0) * ( target - this.transform.position ), dy );
					transform.RotateAround ( target, Vector3.up, dx );
					transform.rotation = Quaternion.LookRotation ( target - this.transform.position );

				// Zoom
				} else if ( !OGRoot.GetInstance().isMouseOver ) {
					var translation = Mathf.Clamp ( Input.GetAxis ( "Mouse ScrollWheel" ), -0.5, 0.5 );
					var speed : float = 10;			

					if ( translation != 0.0 && !OGRoot.GetInstance().isMouseOver ) {				
						this.transform.position += this.transform.forward * ( translation * speed );
					
						var viewportPoint : Vector3 = camera.WorldToViewportPoint ( focus );

						if ( viewportPoint.z < 0 || !( new Rect ( 0, 0, 1, 1 ) ).Contains ( viewportPoint ) ) {
							OEWorkspace.GetInstance().SetFocus ( this.transform.position + this.transform.forward * 3 );
						}
					}
				}
			}

			// Lighting
			if ( dynamicLights ) {
				RenderSettings.ambientLight = defaultAmbientLight;
			
			} else {
				RenderSettings.ambientLight = Color.white;

			}

			// Near clipping
			this.camera.nearClipPlane = 0.01 + nearClipSlider.sliderValue * 100;

			// Set grid focus
			materials.grid.SetVector ( "_Focus", focus );
		}
	}
}
