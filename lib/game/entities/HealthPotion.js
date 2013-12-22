ig.module('game.entities.HealthPotion'
	)
  .requires('impact.entity'
  	)
  .defines( function(){
	EntityHealthPotion = ig.Entity.extend({
	size: {x:16,y:16},	/* the size of a healthpotion */
	// how to behave when active collision occurs
	collides: ig.Entity.COLLIDES.NEVER,
	type: ig.Entity.TYPE.B,
	checkAgainst: ig.Entity.TYPE.A,
	// where to find the animation sheet
	animSheet: new ig.AnimationSheet('media/graphics/consumables/healthpotion.png',20,25),
		// init function
		init: function(x, y , settings){
			this.parent(x,y,settings);		/* the defaults */
			this.addAnim('idle', 1,[0]);     /* show the healthpotion */
		},
		check: function(other){
			ig.game.addHealth(); 	// give the player a healthpotion when picked up
			this.kill(); 			// disappear if you are picked up
		}
	})
});