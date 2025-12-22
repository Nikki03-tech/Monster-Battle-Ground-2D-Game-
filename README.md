Monster Battleground:

Monster Battleground is a 2D real-time arena combat game developed using JavaScript (ES6) and HTML5 Canvas. The project demonstrates core game development principles such as game loops, entity-based architecture, collision detection, and performance-oriented rendering.

The player controls a character within a bounded battleground and must survive against progressively challenging waves of monsters. The game emphasizes responsiveness, modular design, and clean separation of responsibilities across game components.

Gameplay Overview:

Arena-based combat with continuous enemy spawning

Player movement using keyboard input

Projectile-based attack system

Enemy AI with directional movement toward the player

Wave-based difficulty scaling

Score tracking and power-up mechanics

System Architecture:

The game follows a component-driven architecture, where each entity encapsulates its own state and behavior.

Core Components

Game Loop

Implemented using requestAnimationFrame

Handles rendering, updates, and frame synchronization

Player Module

Manages movement, shooting, health, and power-ups

Processes keyboard and mouse events

Enemy Module

Spawns dynamically based on wave logic

Implements basic AI to track and move toward the player

Projectile System

Handles creation, movement, and lifecycle of bullets

Optimized removal of off-screen projectiles

Collision Engine

Axis-Aligned Bounding Box (AABB) collision detection

Resolves interactions between player, enemies, and projectiles

Power-Up System

Temporary stat modifications (speed, fire rate, damage)

Time-based expiration handling

UI & HUD

Displays score, health, and wave information

Rendered directly on the canvas for performance

Rendering Pipeline:

Clear canvas for each frame

Update all entities (player, enemies, projectiles)

Perform collision checks

Apply state changes (damage, removal, scoring)

Render entities and UI elements

The pipeline is optimized to minimize unnecessary redraws and object allocations.

Controls: Action Input Move WASD / Arrow Keys Shoot Mouse Click / Spacebar Pause P

Technologies Used:

JavaScript (ES6+)

HTML5 Canvas API

CSS3 (UI styling)

requestAnimationFrame for smooth rendering

Key Learning Outcomes:

Game loop implementation and frame control

Real-time collision detection

Modular JavaScript design

Canvas-based rendering optimization

Event-driven input handling

Future Enhancements:

Advanced enemy AI behaviors

Boss fights and special attack patterns

Sound effects and background music

Mobile touch support

Save/load game state
