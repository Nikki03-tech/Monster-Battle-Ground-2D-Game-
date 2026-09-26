import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCU2wRnU-8O8SPk9AgUBBnjKMfE82GQ6Ds",
    authDomain: "monster-battle-ground.firebaseapp.com",
    projectId: "monster-battle-ground",
    storageBucket: "monster-battle-ground.firebasestorage.app",
    messagingSenderId: "569924636272",
    appId: "1:569924636272:web:7d99af119f2fd39dc12eb5",
    measurementId: "G-Y9HEEBHBXT"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUser = null;
let gameResultSaved = false;

onAuthStateChanged(auth, (user) => {
    currentUser = user;
});
this.winningScore = 100;window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1000;
    canvas.height = 500;
  
  
    const upButton = document.getElementById('upButton');
    const downButton = document.getElementById('downButton');
    const shootButton = document.getElementById('shootButton');
    
    class InputHandler {
        constructor(game) {
            this.game = game;

            // ==========================================
            // KEYBOARD CONTROLS
            // ==========================================

            window.addEventListener('keydown', e => {

                // UP
                if (e.key === 'ArrowUp') {
                    e.preventDefault();

                    if (this.game.keys.indexOf('ArrowUp') === -1) {
                        this.game.keys.push('ArrowUp');
                    }
                }

                // DOWN
                if (e.key === 'ArrowDown') {
                    e.preventDefault();

                    if (this.game.keys.indexOf('ArrowDown') === -1) {
                        this.game.keys.push('ArrowDown');
                    }
                }

                // SPACE = SHOOT
                if (e.code === 'Space') {
                    e.preventDefault();

                    if (!this.game.gameOver) {
                        this.game.player.shootTop();
                    }
                }

                // D = DEBUG
                if (e.key.toLowerCase() === 'd') {
                    this.game.debug = !this.game.debug;
                }
            });


            window.addEventListener('keyup', e => {

                if (
                    e.key === 'ArrowUp' ||
                    e.key === 'ArrowDown'
                ) {

                    const index =
                        this.game.keys.indexOf(e.key);

                    if (index > -1) {
                        this.game.keys.splice(index, 1);
                    }
                }
            });


            // ==========================================
            // SCREEN UP BUTTON
            // ONE CLICK = MOVE UP
            // ==========================================

            upButton.addEventListener('pointerdown', e => {

                e.preventDefault();

                if (this.game.gameOver) return;

                this.game.player.y -= 30;

                if (this.game.player.y < 0) {
                    this.game.player.y = 0;
                }
            });


            // ==========================================
            // SCREEN DOWN BUTTON
            // ONE CLICK = MOVE DOWN
            // ==========================================

            downButton.addEventListener('pointerdown', e => {
                e.preventDefault();

                if (this.game.gameOver) return;

                this.game.player.y += 30;

                if (this.game.player.y < 0) {
                    this.game.player.y = 0;
                }
            });


            // ==========================================
            // SCREEN SHOOT BUTTON
            // ==========================================

            shootButton.addEventListener('pointerdown', e => {

                e.preventDefault();

                if (this.game.gameOver) return;

                this.game.player.shootTop();
                if (this.game.player.y < 0) {
                    this.game.player.y = 0;
                }
            });
        }
    }
    class Projectile {
        constructor(game, x, y) {
            this.game = game;
            this.x = x;
            this.y = y;
            this.width = 10;
            this.height = 3;
            this.speed = 3;
            this.markedForDeletion = false;
            this.image = document.getElementById('projectile');
            this.frameX = Math.floor(Math.random() * 3);
            this.frameY = Math.floor(Math.random() * 3);
        }
  
        update() {
            this.x += this.speed;
            if (this.x > this.game.width * 0.8) this.markedForDeletion = true;
        }
  
        draw(context) {
            context.drawImage(this.image, this.x, this.y);
        }
    }
  
    class Particle {
        constructor(game, x, y) {
            this.game = game;
            this.x = x;
            this.y = y;
            this.image = document.getElementById('gears');
            this.frameX = Math.floor(Math.random() * 3);
            this.frameY = Math.floor(Math.random() * 3);
            this.spriteSize = 50;
            this.sizeModifier = (Math.random() * 0.5 + 0.5).toFixed(1);
            this.size = this.spriteSize * this.sizeModifier;
            this.speedX = Math.random() * 6 - 3;
            this.speedY = Math.random() * -15;
            this.gravity = 0.5;
            this.markedForDeletion = false;
            this.angle = 0;
            this.va = Math.random() * 0.2 - 0.1;
            this.bounced = 0;
            this.bottomBounceBoundary = Math.random() * 80 + 60;
        }
  
        update() {
            this.angle += this.va;
            this.speedY += this.gravity;
            this.x -= this.speedX + this.game.speed;
            this.y += this.speedY;
            if (this.y > this.game.height + this.size || this.x < 0 - this.size) this.markedForDeletion = true;
            if (this.y > this.game.height - this.bottomBounceBoundary && this.bounced < 2) {
                this.bounced++;
                this.speedY *= -0.5;
            }
        }
  
        draw(context) {
            context.save();
            context.translate(this.x, this.y);
            context.rotate(this.angle);
            context.drawImage(this.image, this.frameX * this.spriteSize, this.frameY * this.spriteSize, this.spriteSize, this.spriteSize, this.size * -0.5, this.size * -0.5, this.size, this.size);
            context.restore();
        }
    }
    class Player {
      constructor(game) {
          this.game = game;
          this.width = 120;
          this.height = 190;
          this.x = 20;
          this.y = 100;
          this.frameX = 0; // Current frame in the sprite sheet (x-axis)
          this.frameY = 0; // Current row in the sprite sheet (y-axis)
          this.maxFrame = 37; // Maximum number of frames in the sprite sheet
          this.speedY = 0; // Vertical speed
          this.maxSpeed = 3; // Maximum vertical speed
          this.projectiles = []; // Array to store active projectiles
          this.image = document.getElementById('player'); // Player sprite sheet
          this.powerUp = false; // Power-up state
          this.powerUpTimer = 0; // Timer for power-up duration
          this.powerUpLimit = 10000; // Duration of power-up in milliseconds
      }
  
      update(deltaTime) {
          // Handle vertical movement
          if (this.game.keys.includes('ArrowUp')) this.speedY = -this.maxSpeed;
          else if (this.game.keys.includes('ArrowDown')) this.speedY = this.maxSpeed;
          else this.speedY = 0;
          this.y += this.speedY;
  
          // Vertical boundaries
          if (this.y > this.game.height - this.height) this.y = this.game.height - this.height; // Bottom boundary
          else if (this.y < 0) this.y = 0; // Top boundary
  
          // Update projectiles
          this.projectiles.forEach(projectile => {
              projectile.update();
          });
          this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion);
  
          // Animate sprite
          if (this.frameX < this.maxFrame) this.frameX++;
          else this.frameX = 0;
  
          // Handle power-up state
          if (this.powerUp) {
              if (this.powerUpTimer > this.powerUpLimit) {
                  this.powerUpTimer = 0;
                  this.powerUp = false;
                  this.frameY = 0; // Reset to normal sprite row
              } else {
                  this.powerUpTimer += deltaTime;
                  this.frameY = 1; // Use power-up sprite row
                  if (this.game.ammo < this.game.maxAmmo) this.game.ammo += 0.1; // Replenish ammo
              }
          }
      }
  
      draw(context) {
          // Draw debug rectangle
          if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
  
          // Draw projectiles
          this.projectiles.forEach(projectile => {
              projectile.draw(context);
          });
  
          // Draw player sprite
          context.drawImage(
              this.image,
              this.frameX * this.width, // Source x
              this.frameY * this.height, // Source y
              this.width, // Source width
              this.height, // Source height
              this.x, // Destination x
              this.y, // Destination y
              this.width, // Destination width
              this.height // Destination height
          );
      }
  
      shootTop() {
          if (this.game.ammo > 0) {
              this.projectiles.push(new Projectile(this.game, this.x + 80, this.y + 30));
              this.game.ammo--;
          }
          if (this.powerUp) this.shootBottom(); // Shoot additional projectile if powered up
      }
  
      shootBottom() {
          if (this.game.ammo > 0) {
              this.projectiles.push(new Projectile(this.game, this.x + 80, this.y + 175));
          }
      }
  
      enterPowerUp() {
          this.powerUpTimer = 0;
          this.powerUp = true;
          if (this.game.ammo < this.game.maxAmmo) this.game.ammo = this.game.maxAmmo; // Replenish ammo
      }
  }
  
    class Enemy {
        constructor(game) {
            this.game = game;
            this.x = this.game.width;
            this.speedX = Math.random() * -1.5 - 0.5;
            this.markedForDeletion = false;
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrame = 37;
        }
  
        update() {
            this.x += this.speedX - this.game.speed;
            if (this.x + this.width < 0) this.markedForDeletion = true;
            if (this.frameX < this.maxFrame) {
                this.frameX++;
            } else this.frameX = 0;
        }
  
        draw(context) {
            if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
            if (this.game.debug) {
                context.font = '20px Helvetica';
                context.fillText(this.lives, this.x, this.y);
            }
        }
    }
  
    class Angler1 extends Enemy {
        constructor(game) {
            super(game);
            this.width = 228;
            this.height = 169;
            this.y = Math.random() * (this.game.height * 0.95 - this.height);
            this.image = document.getElementById('angler1');
            this.frameY = Math.floor(Math.random() * 3);
            this.lives = 5;
            this.score = this.lives;
        }
    }
  
    class Angler2 extends Enemy {
        constructor(game) {
            super(game);
            this.width = 213;
            this.height = 165;
            this.y = Math.random() * (this.game.height * 0.95 - this.height);
            this.image = document.getElementById('angler2');
            this.frameY = Math.floor(Math.random() * 2);
            this.lives = 6;
            this.score = this.lives;
        }
    }
  
    class LuckyFish extends Enemy {
        constructor(game) {
            super(game);
            this.width = 99;
            this.height = 95;
            this.y = Math.random() * (this.game.height * 0.95 - this.height);
            this.image = document.getElementById('lucky');
            this.frameY = Math.floor(Math.random() * 2);
            this.lives = 5;
            this.score = 15;
            this.type = 'lucky';
        }
    }
  
    class HiveWhale extends Enemy {
        constructor(game) {
            super(game);
            this.width = 400;
            this.height = 227;
            this.y = Math.random() * (this.game.height * 0.95 - this.height);
            this.image = document.getElementById('hivewhale');
            this.frameY = 0;
            this.lives = 20;
            this.score = this.lives;
            this.type = 'hive';
            this.speedX = Math.random() * -1.2 - 0.2;
        }
    }
  
    class Drone extends Enemy {
        constructor(game, x, y) {
            super(game);
            this.width = 155;
            this.height = 95;
            this.x = x;
            this.y = y;
            this.image = document.getElementById('drone');
            this.frameY = Math.floor(Math.random() * 2);
            this.lives = 3;
            this.score = this.lives;
            this.type = 'drone';
            this.speedX = Math.random() * -4.2 - 0.5;
        }
    }
  
    class Layer {
        constructor(game, image, speedModifier) {
            this.game = game;
            this.image = image;
            this.speedModifier = speedModifier; 
            this.width = 17768;
            this.height = 500;
            this.x = 0;
            this.y = 0;
        }
        update() {
            if (this.x <= -this.width) this.x = 0;
            this.x -= this.game.speed * this.speedModifier;
        }
        draw(context) {
            context.drawImage(this.image, this.x, this.y);
            context.drawImage(this.image, this.x + this.width, this.y);
        }
    }
  
    class Background {
        constructor(game) {
            this.game = game;
            this.image1 = document.getElementById('layer1');
            this.image2 = document.getElementById('layer2'); 
            this.image3 = document.getElementById('layer3');
            this.image4 = document.getElementById('layer4');
            this.layer1 = new Layer(this.game, this.image1, 0.2);
            this.layer2 = new Layer(this.game, this.image2, 0.2);
            this.layer3 = new Layer(this.game, this.image3, 0.2);
            this.layer4 = new Layer(this.game, this.image4, 0.2);
            this.layers = [this.layer1, this.layer2, this.layer3, this.layer4];
        }
        update() {
            this.layers.forEach(layer => layer.update());
        }
        draw(context) {
            this.layers.forEach(layer => layer.draw(context));
        }
    }
  
    class Explosion {
      constructor(game, x, y) {
          this.game = game;
          this.spriteWidth = 200;
          this.spriteHeight = 200;
          this.width = this.spriteWidth;
          this.height = this.spriteHeight;
          this.x = x - this.width * 0.5; // Center explosion
          this.y = y - this.height * 0.5; // Center explosion
          this.frameX = 0;
          this.fps = 30;
          this.timer = 0;
          this.interval = 1000 / this.fps;
          this.markedForDeletion = false;
          this.maxFrame = 7; // Adjusted for 8 frames (0-7)
      }
  
      update(deltaTime) {
          this.timer += deltaTime;
          while (this.timer > this.interval) {
              this.frameX++;
              this.timer -= this.interval;
          }
          if (this.frameX > this.maxFrame) this.markedForDeletion = true;
      }
  
      draw(context) {
          context.drawImage(
              this.image,
              this.frameX * this.spriteWidth,
              0,
              this.spriteWidth,
              this.spriteHeight,
              this.x,
              this.y,
              this.width,
              this.height
          );
      }
  }
  
  class SmokeExplosion extends Explosion {
      constructor(game, x, y) {
          super(game, x, y);
          this.image = document.getElementById('smokeExplosion');
      }
  }
  
  class FireExplosion extends Explosion {
      constructor(game, x, y) {
          super(game, x, y);
          this.image = document.getElementById('fireExplosion');
      }
  }
  
    class UI {
      constructor(game) {
          this.game = game;
          this.fontSize = 25;
          this.fontFamily = 'Bangers';
          this.color = 'white';
      }
  
      draw(context) {
          context.save();
          context.fillStyle = this.color;
          context.shadowOffsetX = 2;
          context.shadowOffsetY = 2;
          context.shadowColor = 'black';
          context.font = `${this.fontSize}px ${this.fontFamily}`;

  
          // Draw Score
          context.fillText('Score: ' + this.game.score, 20, 40);
  
          // Draw Timer
          const formattedTime = (this.game.gameTime * 0.001).toFixed(1); // Convert milliseconds to seconds
          context.fillText('Timer: ' + formattedTime, 20, 70);
  
          // Draw Ammo Bar
          if (this.game.player.powerUp) context.fillStyle = '#0000bd'; // Fix invalid color code
          for (let i = 0; i < this.game.ammo; i++) {
              context.fillRect(20 + 5 * i, 90, 3, 20); // Adjusted y-position to avoid overlap
          }
  
          // Draw Game Over Message
          if (this.game.gameOver) {
              console.log('Game Over!'); // Debugging line
              console.log('Score:', this.game.score); // Debugging line
              console.log('Winning Score:', this.game.winningScore); // Debugging line
  
              context.textAlign = 'center';
              let message1;
              let message2;
              if (this.game.score >= this.game.winningScore) {
                  message1 = 'You Win!';
                  message2 = 'Well done!';
              } else {
                  message1 = 'You Lose!';
                  message2 = 'Try again next time!';
              }
              context.font = '70px ' + this.fontFamily;
              context.fillText(message1, this.game.width * 0.5, this.game.height * 0.5 - 20);
              context.font = '25px ' + this.fontFamily;
              context.fillText(message2, this.game.width * 0.5, this.game.height * 0.5 + 20);
          }
  
          context.restore();
      }
  }
    
    function createGameOverScreen(game) {
    const overlay = document.createElement('div');

    overlay.id = 'gameOverScreen';

    overlay.innerHTML = `
        <div class="game-over-box">
            <h1 id="gameOverTitle">You Lose!</h1>
            <p id="gameOverMessage">Try again next time!</p>
            <p id="finalScore">Score: 0</p>

            <div class="game-over-buttons">
                <button id="playAgainButton" type="button">
                    Play Again
                </button>

                <button id="homeButton" type="button">
                    Home
                </button>
            </div>
        </div>
    `;

    overlay.style.cssText = `
        position: fixed;
        inset: 0;
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        background: rgba(0, 0, 0, 0.65);
        font-family: Arial, sans-serif;
    `;

    const box = overlay.querySelector('.game-over-box');
    
    box.style.cssText = `
        text-align: center;
        background: rgba(5, 20, 70, 0.92);
        padding: 30px 45px;
        border-radius: 18px;
        min-width: 320px;
        border: 3px solid #174cff;
        box-shadow: 0 0 25px rgba(0, 80, 255, 0.8);
        color: white;
    `;

    const title = overlay.querySelector('#gameOverTitle');
    
    title.style.cssText = `
        color: #174cff;
        font-size: 48px;
        font-weight: 900;
        text-transform: uppercase;
        text-shadow: 3px 3px 0px #000;
        margin-bottom: 10px;
    `;

    overlay.querySelectorAll('button').forEach(button => {
    
        button.style.cssText = `
            padding: 12px 22px;
            margin: 5px;
            border: 2px solid #174cff;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            background: #174cff;
            color: white;
            box-shadow: 0 0 10px rgba(0, 80, 255, 0.6);
        `;
    });

   

    document.body.appendChild(overlay);


    // PLAY AGAIN
    overlay.querySelector('#playAgainButton')
        .addEventListener('click', () => {

            window.location.reload();

        });


    // HOME
    overlay.querySelector('#homeButton')
        .addEventListener('click', () => {

            window.location.href = "../home/index.html";

        });
}


async function saveGameResult(game, won) {
    if (gameResultSaved) {
        return;
    }

    if (!currentUser) {
        console.log("No logged-in user. Game result was not saved.");
        return;
    }

    try {
        const timePlayed = Math.round(game.gameTime / 1000);

        gameResultSaved = true;

        await addDoc(
            collection(db, "users", currentUser.uid, "games"),
            {
                result: won ? "WIN" : "LOSE",
                score: game.score,
                timePlayed: timePlayed,
                completedAt: serverTimestamp()
            }
        );

        console.log("Game result saved successfully!");
    } catch (error) {
        console.error("Error saving game result:", error);
    }
}


function showGameOverScreen(game, won) {

    const overlay =
        document.getElementById('gameOverScreen');

    saveGameResult(game, won);

    if (!overlay) return;


    if (won) {

        overlay.querySelector('#gameOverTitle')
            .textContent = 'You Win!';

        overlay.querySelector('#gameOverMessage')
            .textContent = 'Well done!';

    } else {

        overlay.querySelector('#gameOverTitle')
            .textContent = 'You Lose!';

        overlay.querySelector('#gameOverMessage')
            .textContent = 'Try again next time!';

    }


    // Blue title styling for BOTH Win and Lose
    const title =
        overlay.querySelector('#gameOverTitle');

    title.style.color = '#174cff';
    title.style.fontSize = '48px';
    title.style.fontWeight = '900';
    title.style.textTransform = 'uppercase';
    title.style.textShadow = '3px 3px 0px #000';


    overlay.querySelector('#finalScore')
        .textContent = `Score: ${game.score}`;


    overlay.style.display = 'flex';
}
     
    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.background = new Background(this);
            this.player = new Player(this);
            this.keys = [];
            this.input = new InputHandler(this);
            this.ui = new UI(this);
            this.enemies = [];
            this.particles = [];
            this.explosions = [];
            this.enemyTimer = 0;
            this.enemyInterval = 2000;
            this.ammo = 20;
            this.maxAmmo = 50; 
            this.ammoTimer = 0;
            this.ammoInterval = 350;
            this.gameOver = false;
            this.score = 0;
            this.winningScore = 65; 
            this.gameTime = 0;
            this.timeLimit = 30000;
            this.speed = 1;
            this.debug = false;
        }
        update(deltaTime) {

    // Stop the game completely after win or lose
            if (this.gameOver) {
                return;
            }

            // Update timer
            this.gameTime += deltaTime;


            // ==========================================
            // 30 SECOND TIME LIMIT
            // ==========================================

            if (this.gameTime >= this.timeLimit) {

                this.gameTime = this.timeLimit;

                this.gameOver = true;

                showGameOverScreen(this, false);

                return;
            }


            // ==========================================
            // BACKGROUND
            // ==========================================

            this.background.update();


            // ==========================================
            // PLAYER
            // ==========================================

            this.player.update(deltaTime);


            // ==========================================
            // AMMO
            // ==========================================

            if (this.ammoTimer > this.ammoInterval) {

                if (this.ammo < this.maxAmmo) {
                    this.ammo++;
                }

                this.ammoTimer = 0;

            } else {

                this.ammoTimer += deltaTime;

            }


            // ==========================================
            // PARTICLES
            // ==========================================

            this.particles.forEach(particle => {

                particle.update();

            });

            this.particles =
                this.particles.filter(
                    particle => !particle.markedForDeletion
                );


            // ==========================================
            // EXPLOSIONS
            // ==========================================

            this.explosions.forEach(explosion => {

                explosion.update(deltaTime);

            });

            this.explosions =
                this.explosions.filter(
                    explosion => !explosion.markedForDeletion
                );


            // ==========================================
            // ENEMIES
            // ==========================================

            this.enemies.forEach(enemy => {

                enemy.update();


                // --------------------------------------
                // PLAYER HITS ENEMY
                // --------------------------------------

                if (this.checkCollision(this.player, enemy)) {

                    enemy.markedForDeletion = true;

                    this.addExplosion(enemy);


                    for (let i = 0; i < enemy.score; i++) {

                        this.particles.push(
                            new Particle(
                                this,
                                enemy.x + enemy.width * 0.5,
                                enemy.y + enemy.height * 0.5
                            )
                        );

                    }


                    if (enemy.type === 'lucky') {

                        this.player.enterPowerUp();

                    } else if (!this.gameOver) {

                        this.score--;

                    }

                }


                // --------------------------------------
                // PROJECTILE HITS ENEMY
                // --------------------------------------

                this.player.projectiles.forEach(projectile => {

                    if (this.checkCollision(projectile, enemy)) {

                        enemy.lives--;

                        projectile.markedForDeletion = true;


                        this.particles.push(
                            new Particle(
                                this,
                                enemy.x + enemy.width * 0.5,
                                enemy.y + enemy.height * 0.5
                            )
                        );


                        // ----------------------------------
                        // ENEMY DESTROYED
                        // ----------------------------------

                        if (enemy.lives <= 0) {


                            for (let i = 0; i < enemy.score; i++) {

                                this.particles.push(
                                    new Particle(
                                        this,
                                        enemy.x + enemy.width * 0.5,
                                        enemy.y + enemy.height * 0.5
                                    )
                                );

                            }


                            enemy.markedForDeletion = true;

                            this.addExplosion(enemy);


                            // Hive enemy creates drones
                            if (enemy.type === 'hive') {

                                for (let i = 0; i < 5; i++) {

                                    this.enemies.push(
                                        new Drone(
                                            this,
                                            enemy.x +
                                                Math.random() * enemy.width,

                                            enemy.y +
                                                Math.random() *
                                                enemy.height * 0.5
                                        )
                                    );

                                }

                            }


                            // Add score
                            if (!this.gameOver) {

                                this.score += enemy.score;

                            }


                            // ==================================
                            // WIN CONDITION - 65 POINTS
                            // ==================================

                            if (this.score >= this.winningScore) {

                                this.score = this.winningScore;

                                this.gameOver = true;

                                showGameOverScreen(this, true);

                                // STOP UPDATE IMMEDIATELY
                                return;

                            }

                        }

                    }

                });

            });


            // ==========================================
            // REMOVE DELETED ENEMIES
            // ==========================================

            this.enemies =
                this.enemies.filter(
                    enemy => !enemy.markedForDeletion
                );


            // ==========================================
            // CREATE NEW ENEMIES
            // ==========================================

            if (
                this.enemyTimer > this.enemyInterval &&
                !this.gameOver
            ) {

                this.addEnemy();

                this.enemyTimer = 0;

            } else {

                this.enemyTimer += deltaTime;

                        }
        }

        // ==========================================
        // DRAW
        // ==========================================

        draw(context) {

            this.background.draw(context);
            this.ui.draw(context);
            this.player.draw(context);

            this.particles.forEach(
                particle => particle.draw(context)
            );

            this.enemies.forEach(
                enemy => enemy.draw(context)
            );

            this.explosions.forEach(
                explosion => explosion.draw(context)
            );

            this.background.layer4.draw(context);
        }


        // ==========================================
        // ADD ENEMY
        // ==========================================

        addEnemy() {

            const randomize = Math.random();

            if (randomize < 0.3) {

                this.enemies.push(
                    new Angler1(this)
                );

            } else if (randomize < 0.6) {

                this.enemies.push(
                    new Angler2(this)
                );

            } else if (randomize < 0.7) {

                this.enemies.push(
                    new HiveWhale(this)
                );

            } else {

                this.enemies.push(
                    new LuckyFish(this)
                );

            }
        }


        // ==========================================
        // ADD EXPLOSION
        // ==========================================

        addExplosion(enemy) {

            const randomize = Math.random();

            if (randomize < 0.5) {

                this.explosions.push(
                    new SmokeExplosion(
                        this,
                        enemy.x + enemy.width * 0.5,
                        enemy.y + enemy.height * 0.5
                    )
                );

            } else {

                this.explosions.push(
                    new FireExplosion(
                        this,
                        enemy.x + enemy.width * 0.5,
                        enemy.y + enemy.height * 0.5
                    )
                );

            }
        }


        // ==========================================
        // COLLISION
        // ==========================================

        checkCollision(rect1, rect2) {

            return (
                rect1.x < rect2.x + rect2.width &&
                rect1.x + rect1.width > rect2.x &&
                rect1.y < rect2.y + rect2.height &&
                rect1.y + rect1.height > rect2.y
            );

        }

    }


    const game = new Game(canvas.width, canvas.height);

    createGameOverScreen(game);

    let lastTime = 0;

    function animate(timeStamp) {

        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;

        if (!game.gameOver) {
            game.update(deltaTime);
        }

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        game.draw(ctx);

        if (!game.gameOver) {
            requestAnimationFrame(animate);
        }
    }

    animate(0);

});