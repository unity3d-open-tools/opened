#pragma strict

public class OEPreviewCamera extends MonoBehaviour {
	private class QueueObject {
		public var gameObject : GameObject;
		public var texture : OGTexture;

		function QueueObject ( g : GameObject, t : OGTexture ) {
			gameObject = g;
			texture = t;
		}
	}

	private var queue : Queue = new Queue();

	public function CreatePreview ( obj : GameObject, tex : OGTexture ) {
		queue.Enqueue ( new QueueObject ( obj, tex ) );
	}

	private function SetLayerRecursively ( obj : GameObject, lay : int ) {
		if ( obj == null ) { return; }
		
		obj.layer = lay;
		
		for ( var i : int = 0; i < obj.transform.childCount; i++ ) {
			if ( obj.transform.GetChild(i) == null ) {
				continue;
			}

			SetLayerRecursively ( obj.transform.GetChild(i).gameObject, lay );
		}
	}

	private function TakeScreenshot () {
		var obj : QueueObject = queue.Dequeue () as QueueObject;
		var go : GameObject = Instantiate ( obj.gameObject ) as GameObject;
		var tex : OGTexture = obj.texture;
		var distance : float = 2;
		var renderer : Renderer = go.GetComponentInChildren.< Renderer > ();

		SetLayerRecursively ( go, this.gameObject.layer );
		go.transform.eulerAngles = this.transform.eulerAngles + new Vector3 ( 0, 180, 0 );
		go.transform.position = Vector3.zero;
		
		this.transform.eulerAngles = Vector3.zero;
	
		if ( renderer ) {
			var b : Bounds = renderer.bounds;

			if ( b.size.x > b.size.y ) {
				distance = b.size.x;
			} else {
				distance = b.size.y;
			}

			distance *= 1.5;

			this.transform.position = b.center - Vector3.forward * distance;
			
		} else {
			this.transform.position = -Vector3.forward * distance;	

		}
		
		var thumb : Texture2D = new Texture2D ( 128, 128, TextureFormat.ARGB32, false );
		thumb.name = "thumb_" + go.name;
	
		var rt : RenderTexture = new RenderTexture ( 128, 128, 24 );
		this.camera.targetTexture = rt;
		
		this.camera.Render();
		
		RenderTexture.active = rt;
	 
		this.camera.Render();
		   
		// Read pixels
		thumb.ReadPixels(new Rect ( 0, 0, 128, 128 ), 0, 0);
		thumb.Apply ();
		tex.mainTexture = thumb;
	  
		// Clean up
		this.camera.targetTexture = null;
		RenderTexture.active = null; // added to avoid errors
		DestroyImmediate ( rt );
		Destroy ( go );
	}

	public function Update () {
		if ( queue.Count > 0 ) {
			TakeScreenshot ();
		}
	}
}
