#pragma strict

public class OECamera extends MonoBehaviour {
	private class Materials {
		public var grid : Material;
		public var selection : Material;
		public var cursor : Material;
		public var light : Material;
	}
	
	public var rotateSensitivity : Vector2 = new Vector2 ( 5, 5 );
	public var panSensitivity : Vector2 = new Vector2 ( 0.2, 0.2 );
	public var materials : Materials;
	public var lights : Light [] = new Light[0];

	private function DrawGrid () {
		GL.Begin ( GL.LINES );

		materials.grid.SetPass ( 0 );		

		GL.Vertex ( Vector3.right * 1000 );
		GL.Vertex ( Vector3.right * -1000 );
		
		GL.Vertex ( Vector3.forward * 1000 );
		GL.Vertex ( Vector3.forward * -1000 );

		GL.End ();
	}

	private function DrawSelection () {
		GL.Begin ( GL.TRIANGLES );

		materials.selection.SetPass ( 0 );

		for ( var i : int = 0; i < OEWorkspace.GetInstance().selection.Count; i++ ) {
			var go : GameObject = OEWorkspace.GetInstance().selection[i].gameObject;
			var meshFilter : MeshFilter = go.GetComponentInChildren.< MeshFilter > ();

			if ( meshFilter ) {
				var mesh : Mesh = meshFilter.mesh;
				var matrix : Matrix4x4 = Matrix4x4.TRS ( go.transform.position, go.transform.rotation, go.transform.lossyScale );
				for ( var t : int = 0; t < mesh.triangles.Length; t++ ) {
					GL.Vertex ( matrix.MultiplyPoint3x4 ( mesh.vertices[mesh.triangles[t]] ) );
				}
			}
		}

		GL.End ();
	}

	private function DrawCursor () {
		var point : Vector3 = OEWorkspace.GetInstance().GetFocus ();
		var size : float = 0.1;

		GL.Begin ( GL.LINES );

		materials.cursor.SetPass ( 0 );

		GL.Vertex ( point - Vector3.forward * size );
		GL.Vertex ( point + Vector3.forward * size );

		GL.Vertex ( point - Vector3.left * size );
		GL.Vertex ( point + Vector3.left * size );
		
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

	public function OnPostRender () {
		GL.PushMatrix ();
		
		DrawCursor ();

		if ( materials.grid ) {
			DrawGrid ();
		}

		if ( materials.selection && OEWorkspace.GetInstance().selection.Count > 0 ) {
			DrawSelection ();
		}

		if ( lights.Length > 0 ) {
			DrawLights ();
		}

		GL.PopMatrix ();
	}

	public function Update () {
		if ( OGRoot.GetInstance() && OGRoot.GetInstance().currentPage.name == "Home" ) {
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
					
					for ( var i : int = 0; i < hits.Length; i++ ) {
						var axis : OEGizmoAxis = hits[i].collider.gameObject.GetComponent.< OEGizmoAxis> (); 
						var hitObj = hits[i].collider.gameObject.GetComponent.< OFSerializedObject > ();

						if ( axis ) {	
							axis.OnMouseDown ();
							return;
						
						} else if ( hitObj ) {
							obj = hitObj;
						
						}
					}
					
					if ( obj ) {
						OEWorkspace.GetInstance().SelectObject ( obj );
					}
				}		
			}

			// Pan
			if ( Input.GetMouseButton ( 2 ) || Input.GetMouseButton ( 0 ) && Input.GetKey ( KeyCode.LeftAlt ) && Input.GetKey ( KeyCode.LeftShift ) ) {
				var dx : float = Input.GetAxis ( "Mouse X" ) * panSensitivity.x;
				var dy : float = Input.GetAxis ( "Mouse Y" ) * panSensitivity.y;

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
				var translation = Input.GetAxis("Mouse ScrollWheel");
				var speed : float = 10;			

				if ( translation != 0.0 && !OGRoot.GetInstance().isMouseOver ) {				
					transform.position += transform.forward * ( translation * speed );
				}
			}
		}
	}
}
