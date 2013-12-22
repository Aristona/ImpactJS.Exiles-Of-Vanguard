ig.module (
	'game.entities.player'
)
.requires(
	'impact.entity'
)
.defines(function(){
	 
	EntityPlayer = ig.Entity.extend({
		
		type: ig.Entity.TYPE.A,
		checkAgainst: ig.Entity.TYPE.NONE,
		collides: ig.Entity.COLLIDES.PASSIVE,

		name: "Player",

		size: {  // collision kutusunun boyutu
			x: 26, 
			y: 10
		},
		offset: {  // collision kutusunun offseti
			x: 3, 
			y: 34
		},

		speed: 100,
		maxHealth: 500,
		health: 150,
		baseDamage: 100,
		potionAmount: 3,
		potionLastUseDate: 0,
		direction: "left",
		
		/* Animasyonu eşit parçalara böl (32,48) */
		animSheet: new ig.AnimationSheet( 'media/player.png', 32, 48 ),
				
		init: function( x, y, settings ) 
		{

			// Animasyonları ekle (ne kadar az o kadar hızlı)
			this.addAnim( 'up', .21, [9,10,11] );
			this.addAnim( 'down', .21, [0,1,2] );
			this.addAnim( 'left', .21, [3,4,5] );
			this.addAnim( 'right', .21, [6,7,8] );
			
			this.addAnim( 'idleup', 0.1, [10] );
			this.addAnim( 'idledown', 0.1, [1] );
			this.addAnim( 'idleleft', 0.1, [4] );
			this.addAnim( 'idleright', 0.1, [7] );
			this.currentAnim = this.anims.idledown;

			this.potionLastUseDate = new Date().getTime();

			if( !ig.global.wm )
			{
				//ig.game.spawnEntity(EntityHealthBar,this.pos.x , this.pos.y, { Unit: this });
				ig.game.spawnEntity(EntityHealthBar,this.pos.x , this.pos.y, { Unit: this });
			}

			this.parent( x, y, settings );
					 
		},
				
		update: function() 
		{

			if( ig.input.state('left') && movingTowards != "up" && movingTowards != "right" && movingTowards != "down") 
			{
				this.vel.x = -this.speed;
				movingTowards = "left";
				this.direction = "left";
				this.currentAnim = this.anims.left;
			}
			else if( ig.input.state('right')  && movingTowards != "up" && movingTowards != "left" && movingTowards != "down") 
			{
				this.vel.x = +this.speed;
				movingTowards = "right";
				this.direction = "right";
				this.currentAnim = this.anims.right;
			}
			else if( ig.input.state('up')  && movingTowards != "left" && movingTowards != "right" && movingTowards != "down") 
			{
				this.vel.y = -this.speed;
				movingTowards = "up";
				this.direction = "up";
			 	this.currentAnim = this.anims.up;
			}
			else if( ig.input.state('down')  && movingTowards != "up" && movingTowards != "right" && movingTowards != "left") 
			{
				this.vel.y = +this.speed;
				movingTowards = "down";
				this.direction = "down";
			 	this.currentAnim = this.anims.down;
			}
			else
			{
				this.vel.x = 0;
				this.vel.y = 0;
				movingTowards = 0;
		
				if( this.direction == "down" )
					this.currentAnim = this.anims.idledown;
				
				if( this.direction == "left" )
					this.currentAnim = this.anims.idleleft;
					 
				if( this.direction == "right" )
					this.currentAnim = this.anims.idleright;
					 
				if( this.direction == "up" )
					this.currentAnim = this.anims.idleup;
		 	}

		 	this.parent();

		},

		canAttack: function()
		{
			// TODO: Bu alanda paralysis, silence gibi işlemlerin kontrolü yapılacak.
			return true;
		},

		attack: function()
		{
			if ( this.canAttack() === false )
				return;

			new ig.Sound( 'media/sound/skills/gun.ogg' ).play();
			ig.game.spawnEntity('EntityLaser', this.pos.x, this.pos.y, { direction: this.direction });

		},

		hasPotion: function()
		{
			return this.potionAmount >= 1;
		},

		receiveDamage:function (damage, object){
			
			if(this.health - damage > 0)
			{
				this.health = this.health - damage;
				return;
			}

			ig.game.respawn();
		},

		usePotion: function()
		{
			// Potionun kadar heal vermesi gerektiğini hesaplayalım.
			// Eğer kullanılan potion toplam HP'yi geçiriyorsa, toplam HP'ye eşitlesin.
			if( (this.maxHealth - this.health) < 50)
			{
				this.health += this.maxHealth - this.health;
				this.potionAmount--;
				this.potionLastUseDate = new Date().getTime();
				return true;
			}

			// Eğer kullanılan potion toplam HP'yi geçirmiyorsa static HP versin.
			if (this.maxHealth - this.health >= 50) 
			{
				this.health += 50;
				this.potionAmount--;
				this.potionLastUseDate = new Date().getTime();
				return true;
			}
		}
		
	});	
});