ig.module('game.entities.Gold'
	)
  .requires('impact.entity'
  	)
  .defines( function(){
	EntityGold = ig.Entity.extend({
	size: {x:16,y:16},	/* the size of a gold */
	// how to behave when active collision occurs
	collides: ig.Entity.COLLIDES.NEVER,
	type: ig.Entity.TYPE.B,
	checkAgainst: ig.Entity.TYPE.A,
	// where to find the animation sheet
	animSheet: new ig.AnimationSheet('media/gold.png',16,16),
		// init function
		init: function(x, y , settings){
			this.parent(x,y,settings);		/* the defaults */
			this.addAnim('idle', 1,[0]);     /* show the gold */
		},
		check: function(other){
			ig.game.addGold(); 	// give the player a gold when picked up
			this.kill(); 		// disappear if you are picked up
		}
	})
});