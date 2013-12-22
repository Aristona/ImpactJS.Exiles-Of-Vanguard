ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.sound',

	// Leveller
	'game.levels.town',
	'game.levels.inside',

	// Entities
	'game.entities.player',
	'game.entities.skills.laser',
	'game.entities.grunt',
	'game.entities.HealthBar',
	'game.entities.HealthInterface',

	// void levelchange entity
	'game.entities.levelchange',
	'game.entities.trigger',
	'game.entities.void',

	//extensions
	'plugins.ai.ai',
	'plugins.joncom.font-sugar.font'

	// Debug
	//'impact.debug.debug'
)
.defines(function() {

gameOver = ig.Game.extend({

	init: function() {
		this.sound = new ig.Sound( 'media/music/town.ogg' );
		this.sound.play();
	},
	
	draw: function() {
		this.parent();
		new ig.Image('media/graphics/screens/gameOver.png').draw(0,0);
	}
}),

gameStart = ig.Game.extend({
	
	font: {
		interface: 	new ig.Font('media/font.png', { borderColor: '#000', fontColor: '#ccc', borderSize: 10, letterSpacing: 1})
	},

	init: function() {

		ig.music.add( 'media/music/intro.ogg', ['Intro']);
		ig.music.volume = 1;
		ig.music.loop = true;
		ig.music.play("Intro");

		ig.input.bind( ig.KEY._1,	 'gameStart' );
		ig.input.bind( ig.KEY._2,	 'gameContinue' );
		ig.input.bind( ig.KEY._3,	 'credits' );

	},

	draw: function() 
	{

		this.parent();

		new ig.Image('media/graphics/screens/gameStart.png').draw(0,0);

		//Bunları aşağı yazıyoruz ki resim üzerlerine çıkmasın
		this.font.interface.draw("1", 270, 293);
		this.font.interface.draw("2", 270, 355);
		this.font.interface.draw("3", 270, 411);

	},

	update: function() {

		if( ig.input.state('gameStart') )
		{
			ig.system.setGame(game);
		}

		if( ig.input.state('gameContinue') )
		{
			
		}

		ig.input.state('credits')
		{
			
		}

	}
}),

game = ig.Game.extend({
	
	font: {
		interface: 	new ig.Font('media/font.png', { borderColor: '#000', fontColor: '#ccc', borderSize: 1, letterSpacing: 1}),
		error: 		new ig.Font('media/font.png', { borderColor: '#000', fontColor: '#ff0000', borderSize: 3, letterSpacing: 2})
	},

	sound: {

		consumables: {
				
			gold: function() {
				var sound =  new ig.Sound( 'media/sound/consumables/gold.ogg' )
				sound.volume = 0.6;
				return sound;
			},

			potion: function() {
				var sound = new ig.Sound( 'media/sound/consumables/potion.ogg' );
				sound.volume = 1;
				return sound;
			}

		},

		general: {

			error: function() {
				var sound = new ig.Sound( 'media/sound/general/error.ogg' );
				sound.volume = 0.3;
				return sound;
			}

		},

		skills: {

			laser: function() {
				var sound = new ig.Sound( 'media/sound/skills/laser.ogg' );
				sound.volume = 0.8;
				return sound;
			}
		}
	},

	player: 0, // PlayerEntity'i reference eder
	gold: 0,
	experience: 0,
	currentLevel: "Town",

	init: function() {

		// Tuşları bindleyelim
		ig.input.bind( ig.KEY.A, 		'left' );
		ig.input.bind( ig.KEY.D, 		'right' );
		ig.input.bind( ig.KEY.W, 		'up' );
		ig.input.bind( ig.KEY.S, 		'down' );
		ig.input.bind( ig.KEY.SPACE, 	'attack');
		ig.input.bind( ig.KEY.Q, 		'usepotion');

		// Başlangıç haritasını yükleyelim
		this.loadLevel (LevelTown);

		// Main karakterimizi spawnlayalım
		ig.game.spawnEntity(EntityPlayer, 570, 600);

		// Arkaplan müziğini çalalım
		ig.music.add('media/music/town.ogg', ['Town']);
		ig.music.add('media/music/inside.ogg', ['Inside']);
		ig.music.volume = 1;
		ig.music.play("Town");
	},
	
	update: function() {
		// Update all entities and background maps
		this.parent();
		
		// Add your own, additional update code here
		player = this.getEntitiesByType( EntityPlayer )[0];

		if( typeof player === "object") {
			this.screen.x = player.pos.x - ig.system.width/2;
			this.screen.y = player.pos.y - ig.system.height/2;
		}
	},
	
	draw: function() {
		// Draw all entities and background maps
		this.parent();

		new ig.Image('media/graphics/interfaces/interface.png').draw(0, (ig.system.height  - 20));

		// Oyuncu nicki
		this.font.interface.draw("NAME: " + player.name.toUpperCase(), 20, 20, ig.Font.ALIGN.LEFT);

		// HP Durumu
		this.font.interface.draw("HEALTH: " + player.maxHealth + " / " + player.health, 20, 40, ig.Font.ALIGN.LEFT );

		// Potion Sayısı
		this.font.interface.draw("POTION: " + player.potionAmount, 20, 60, ig.Font.ALIGN.LEFT );

		// Altın Durumu
		this.font.interface.draw("GOLD: " + this.gold, 20, 80, ig.Font.ALIGN.LEFT );

		// Experience Durumu
		this.font.interface.draw("EXPERIENCE: " + this.experience, 20, 100, ig.Font.ALIGN.LEFT );

		// Attack mechanism
		if( ig.input.state('attack') )
		{
			this.font.error.draw("ATTACK!", 20, 430);
			player.attack();
		}

		// Use potion mechanism
		if( ig.input.state('usepotion') )
		{

			// Potion var mı?
			if ( player.hasPotion() === false ) 
			{
				this.font.error.draw("No potions left!", 20, 430);
				this.sound.general.error().play();
				return false;
			}

			// Zaten MAX hp isek potion kullanmaya gerek yok!
            if (player.health === player.maxHealth) 
            {
            	this.font.error.draw("You are already MAX HP!", 20, 430);
            	this.sound.general.error().play();
            	return false;
            }

            // 5 saniye cooldown geçmemişse potion kullanmaya izin vermeyelim.
            var date 		= new Date().getTime();
            var timeElapsed = date - player.potionLastUseDate;

            if(timeElapsed <= 5000)
            {
            	this.font.error.draw("Potion on cooldown!", 20, 430);
            	this.sound.general.error().play();
            	return false;
            }
			
			// Herşey yolunda, potionumuzu basabiliriz.
			player.usePotion();
			this.sound.consumables.potion().play();
			this.font.error.draw("Potion used!", 20, 430);
		}
	},

	//respawn function for the player
	respawn: function() {
		ig.system.setGame(gameOver);
	},

	addGold: function() {
		this.sound.consumables.gold().play();
		this.gold += 5;
	},

	addHealth: function() {
		this.sound.consumables.potion().play();
		player.health = player.maxHealth;
	},

	changeBackgroundMusic: function (levelName) {


		ig.music.stop();
		console.log(levelName);
		console.log(typeof levelName);

		ig.music.play(levelName);
	}
});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', gameStart, 60, 640, 480, 1);

});
