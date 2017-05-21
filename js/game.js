(function() {
    var game = new Phaser.Game(405, 600, Phaser.AUTO, 'container', { preload: preload, create: create, update: update });
    var platforms;
    var bat;
    var ball;
    var ground;
    var score = 0;
    var scoreText;
    var modal;

    var MAX_SPEED = 500;

    function preload() {
        game.load.image('bat', 'assets/bat.png');
        game.load.image('bar', 'assets/bar.png');
        game.load.image('ball', 'assets/ball.png');
        game.load.image('ground', 'assets/platform.png');
    }

    function create() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        game.stage.backgroundColor = "#ccc";

        platforms = game.add.group();
        platforms.enableBody = true;

        ground = platforms.create(0, game.world.height - 16, 'ground');
        ground.body.immovable = true;

        createBat();

        createBall();

        bars = game.add.group();
        bars.enableBody = true;
        createBars();

        cursors = game.input.keyboard.createCursorKeys();

        scoreText = game.add.text(16, 12, 'Score: 0', { font: '20px Arial', fill: '#555' });

        stateText = game.add.text(72, game.world.centerY, '', { font: '24px Arial', fill: '#555' });
        stateText.visible = false;
    }

    function update() {
        game.physics.arcade.collide(ball, bat, batStrike, null, this);
        game.physics.arcade.collide(ball, bars, barStrike, null, this);
        game.physics.arcade.collide(ball, ground, hitGround, null, this);

        if(cursors.left.isDown) {
            bat.body.velocity.x = -300;
        } else if (cursors.right.isDown) {
            bat.body.velocity.x = 300;
        } else {   
            bat.body.velocity.x = 0;
        }
    }

    function createBat() {
        bat = game.add.sprite(160, 520, 'bat');
        game.physics.arcade.enable(bat);
        bat.body.immovable = true;
        bat.body.collideWorldBounds = true;
    }

    function createBall() {
        ball = game.add.sprite(160, 200, 'ball');
        game.physics.arcade.enable(ball);
        ball.body.velocity.setTo(100, 350);
        ball.body.collideWorldBounds = true;
        ball.body.bounce.set(1.01);
    }

    function createBars() {
        for(var x = 0; x < 5; x++) {
            for (var y = 0; y < 4; y++) {
                var bar = bars.create(1 + x * 101, 48 + y * 18, 'bar');
                bar.body.immovable = true;
            }
        }
    }

    function batStrike(ball, bat) {
        if(isCornerHit(ball, bat)) {
            if(Math.abs(ball.body.velocity.y) < MAX_SPEED) {
                if(ball.body.velocity.x > 0) {
                    ball.body.velocity.x += 5;
                    ball.body.velocity.y += 10;
                } else {
                    ball.body.velocity.x -= 5;
                    ball.body.velocity.y -= 10;
                }
            }
        }
    }

    function barStrike(ball, bar) {
        bar.kill();

        score += 10;
        scoreText.text = 'Score: ' + score;

        if(score == 160) {
            setTimeout(function() {
                gameOver("You won! Click to restart.");
            }, 10);
        }
    }

    function hitGround(ball, ground) {
        gameOver("You lost! Click to restart.")
    }

    function isCornerHit(ball, bat) {
        //increase speed if ball hits the corner thirds of the bat
        var ballPosX = (ball.body.x + ball.body.width/2);
        if(ballPosX < bat.body.x + bat.body.width/3 || ballPosX > bat.body.x + 2*bat.body.width/3) {
            return true;
        }
        return false;
    }

    function gameOver(msg) {
        game.paused = true;
        ball.kill();
        stateText.text = msg;
        stateText.visible = true;
        game.input.onTap.addOnce(restart, this);
    }

    function restart() {
        bars.removeAll();
        bat.kill();
        createBars();
        createBat();
        createBall();
        stateText.visible = false;
        score = 0;
        scoreText.text = 'Score: 0';
        game.paused = false;
    }
})();