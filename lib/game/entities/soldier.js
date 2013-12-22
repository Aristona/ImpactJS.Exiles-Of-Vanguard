ig.module('game.entities.soldier')
.requires('impact.entity', 'plugins.ai.ai')
.defines(function() {
	EntitySoldier = ig.Entity.extend({			
		
		collides: ig.Entity.COLLIDES.PASSIVE,
		type: ig.Entity.TYPE.B,
		checkAgainst: ig.Entity.TYPE.A,

		//the defaults
		name: 'Soldier',		/* Let's call him the Boss*/
		size: {
			x:16,
			y:40
		},  /* the default size */
		offset: {
			x:8,
			y:4
		},   /* shift the box to detect collisions a bit */
		health: 400, 		/* And make him healthier than every other enemy*/
		maxHealth: 400,
		zIndex:1,			/* He isn't more important to show than the player so if they occupy the same space show him below the player*/
		speed:25, 			/* The default speed is higher than an enemy*/
		animSheet: new ig.AnimationSheet('media/graphics/entities/soldier.png',32,48),	/* where to find the animation sheet */
	
		init: function(x, y , settings){		
			/* use our basic artificial intelligence engine */
			ai = new ig.ai(this);		
			/* define the possible animations */
			this.addAnim('idle',1,[0]);
			this.addAnim('down',0.1,[0,1,2,3,2,1,0]);
			this.addAnim('left',0.1,[4,5,6,7,6,5,4]);
			this.addAnim('right',0.1,[8,9,10,11,10,9,8]);
			this.addAnim('up',0.1,[12,13,14,15,14,13,12]);

			if( !ig.global.wm )
			{
				ig.game.spawnEntity(EntityHealthBar,this.pos.x , this.pos.y, { Unit: this });
			}

			/* use the defaults	*/
			this.parent(x,y,settings);
		},

		update: function(){
			
			/* let the artificial intelligence engine tell us what to do */
			action = ai.getAction(this);

			/* listen to the commands with an appropriate animation and velocity */
			switch(action){
				case ig.ai.ACTION.Rest: 
						this.currentAnim =  this.anims.idle;
						this.vel.x = 0;
						this.vel.y = 0;	
						break;
				case ig.ai.ACTION.MoveLeft	: 
						this.currentAnim = this.anims.left;
						this.vel.x = -this.speed;	
						break;
				case ig.ai.ACTION.MoveRight : 
						this.currentAnim = this.anims.right;
						this.vel.x = this.speed;
						break;
				case ig.ai.ACTION.MoveUp	: 
						this.currentAnim = this.anims.up;
						this.vel.y = -this.speed;			
						break;
				case ig.ai.ACTION.MoveDown	: 
						this.currentAnim = this.anims.down;
						this.vel.y = this.speed;	  	
						break;
				case ig.ai.ACTION.Attack:
						this.currentAnim = this.anims.idle;
						this.vel.x = 0;
						this.vel.y = 0;
						player.receiveDamage(1,this);
						break;
				default	: 
						this.currentAnim =  this.anims.idle;
						this.vel.x = 0;
						this.vel.y = 0;	
						break;
			}
			/* use the defaults */
			this.parent();
		},

		receiveDamage: function(amount,from){
			/* override the default because we want an end screen (or animation) */
			/* the boss is stronger then everyone, so he doesn't get damaged that fast */
			amount = amount / 2;
			if(this.health - amount <= 0){
				ig.game.experience += 25;
				this.kill();
			}

			/* update the health status */
			this.health = this.health - amount;
		}
	})
});