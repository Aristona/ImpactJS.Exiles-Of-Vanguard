ig.module('game.entities.skills.laser')
.requires('impact.entity')
.defines( function() {

	EntityLaser = ig.Entity.extend({

		size: { 
			x: 8,
			y: 4
		},

		vel: { 
			x: 0,
			y: 0 
		},
		maxVel: {
			x: 300,
			y: 300
		},

		bounciness: 1,
		lifetime: 0,
		direction: 0,

		collides: ig.Entity.COLLIDES.NONE,
		type: ig.Entity.TYPE.A, //dost türü
		checkAgainst: ig.Entity.TYPE.B, //düşmana çarpabilir
		
		animSheetX: new ig.AnimationSheet('media/graphics/skills/laser_x.png', 8, 4),
		animSheetY: new ig.AnimationSheet('media/graphics/skills/laser_y.png', 4, 8),
	
		// init function
		init: function(x, y, settings) {

			this.parent(x, y, settings);

			this.anims.xaxis = new ig.Animation( this.animSheetX, 1, [0]);
			this.anims.yaxis = new ig.Animation( this.animSheetY, 1, [0]);
			this.currentAnim = this.anims.xaxis;        

			if(this.direction === "right")
			{
				this.vel.x = 300;
				this.vel.y = 0;
				this.currentAnim = this.anims.xaxis;
				this.anims.xaxis.flip.x = false;
			}
			else if (this.direction === "left")
			{
				this.vel.x = -300;
				this.vel.y = 0;
				this.currentAnim = this.anims.xaxis;
				this.anims.xaxis.flip.x = true;
			}
			else if (this.direction === "up")
			{
				this.vel.x = 0;
				this.vel.y = -300;
				this.currentAnim = this.anims.yaxis;
				this.anims.yaxis.flip.y = false;
			}
			else
			{
				this.vel.x = 0;
				this.vel.y = 300;
				this.currentAnim = this.anims.yaxis;
				this.anims.yaxis.flip.y = true;
			}
		},

		update:function() {
	
			if (this.startvelocity == -(this.vel.x) && this.direction == 'right'){this.anims.xaxis.flip.x = true;}
			else if (this.startvelocity == -(this.vel.x) && this.direction == 'left'){this.anims.xaxis.flip.x = false;}
			else if (this.startvelocity == -(this.vel.y) && this.direction == 'up'){this.anims.yaxis.flip.y = true;}
			else if (this.startvelocity == -(this.vel.y) && this.direction == 'down'){this.anims.yaxis.flip.y = false;} 

			// a lifetime of 100 fps else kill
			if(this.lifetime <=100){this.lifetime +=1;}else{this.kill();}	
			this.parent();	
		},

		check: function(other){
			other.receiveDamage(100,this);
			this.kill();
			this.parent();
		}

	})
});