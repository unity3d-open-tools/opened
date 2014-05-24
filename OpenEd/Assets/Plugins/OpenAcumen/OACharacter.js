#pragma strict

public enum OABehaviour {
	ChasePlayer,
	Idle,
	RoamingPath,
	RoamingRandom,
	SearchForPlayer,
	GoToGoal,
}

public class OACharacter extends MonoBehaviour {
	public var isEnemy : boolean = false;
	public var player : GameObject;
	public var health : float = 100;
	public var behaviour : OABehaviour = OABehaviour.Idle;
	public var speed : float = 0;
	private var animator : Animator;

	// Inventory
	public var inventory : OSInventory;
	public var usingWeapons : boolean = true;
	public var weaponCategoryPreference : int = 0;
	public var weaponSubcategoryPreference : int = 0;
	
	// Conversation
	public var conversationTree : OCTree;
	public var convoRootNode : int = 0;
	public var convoSpeakers : GameObject [] = new GameObject[1];

	// Path
	public var pathFinder : OPPathFinder;
	public var pathGoals : Vector3 [] = new Vector3[0];
	public var updatePathInterval : float = 5;
	private var updatePathTimer : float = 0;
	private var currentPathGoal : int = -1;

	public function get preferredWeapon () : OSItem {
		if ( inventory && inventory.definitions ) {
			var cat : OSCategory = inventory.definitions.categories[weaponCategoryPreference];
			var subcat : String = cat.subcategories[weaponSubcategoryPreference];
			
			return inventory.FindItemByCategory ( cat.id, subcat );
		
		} else {
			return null;
		
		}
	}

	public function set running ( value : boolean ) {
		if ( !value ) {
			if ( speed > 0 ) {
				speed = 0.25;
			}
		
		} else {
			if ( speed > 0 ) {
				speed = 0.75;
			}

		}
	}

	public function get running () : boolean {
		return speed >= 0.5;
	}

	public function TeleportToNextPathGoal () {
		if ( currentPathGoal + 1 < pathGoals.Length ) {
			currentPathGoal++;
		} else {
			currentPathGoal = 0;
		}

		this.transform.position = pathGoals [ currentPathGoal ];

		behaviour = OABehaviour.Idle;
		speed = 0;
	}

	public function NextPathGoal () {
		if ( currentPathGoal + 1 < pathGoals.Length ) {
			currentPathGoal++;
		} else {
			currentPathGoal = 0;
		}

		behaviour = OABehaviour.GoToGoal;
		speed = 0.25;
	}

	public function TakeDamage ( damage : float ) {
		health -= damage;
	}

	public function OnProjectileHit ( damage : float ) {
		TakeDamage ( damage );
	}

	public function Die () {
		
	}

	public function UpdateSpeakers () {
		if ( conversationTree ) {
			conversationTree.currentRoot = convoRootNode;

			for ( var i : int = 0; i < convoSpeakers.Length; i++ ) {
				conversationTree.speakers[i].gameObject = convoSpeakers[i];
			}
		}
	}

	public function Start () {
		UpdateSpeakers ();
		animator = this.GetComponent.< Animator > ();
	}

	public function Update () {
		switch ( behaviour ) {
			case OABehaviour.ChasePlayer:
				if ( player && pathFinder && updatePathTimer <= 0 ) {
					pathFinder.SetGoal ( player.transform.position );
				}
				break;
			
			case OABehaviour.Idle:
				speed = 0;
				break;

			case OABehaviour.RoamingPath:
				if ( pathGoals.Length > 0 && pathFinder ) {
					if ( Vector3.Distance ( this.transform.position, pathGoals[currentPathGoal] ) < 0.5 ) {
						NextPathGoal ();
						behaviour = OABehaviour.RoamingPath;

					} else {
						pathFinder.SetGoal ( pathGoals[currentPathGoal] );
					
					}
				}
				break;

			case OABehaviour.GoToGoal:
				if ( pathGoals.Length > 0 && pathFinder ) {
					if ( Vector3.Distance ( this.transform.position, pathGoals[currentPathGoal] ) < 0.5 ) {
						behaviour = OABehaviour.Idle;

					} else {
						pathFinder.SetGoal ( pathGoals[currentPathGoal] );
				
					}
				}
				break;

		}

		if ( updatePathTimer > 0 ) {
			updatePathTimer -= Time.deltaTime;
		}

		if ( health <= 0 ) {
			Die ();
		}

		if ( animator ) {
			animator.SetFloat ( "Speed", speed );
		}

		if ( speed > 0 && pathFinder ) {
			var lookPos : Vector3 = pathFinder.GetCurrentGoal() - this.transform.position;
			lookPos.y = 0;
			
			transform.rotation = Quaternion.Slerp( transform.rotation, Quaternion.LookRotation( lookPos ), 4 * Time.deltaTime );
		}
	}
}
