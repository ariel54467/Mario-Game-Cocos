# Assignment 02 - Web Canvas Platformer

<p align="center">
  <img src="assets/pictures/title_0.png" alt="Game title asset" width="220">
</p>

This repository contains a Cocos Creator web canvas game built for Software Studio 2025 Spring, Assignment 02. The project is a Mario-inspired 2D platformer with physics-based movement, enemy interactions, mystery blocks, power-ups, score tracking, Firebase login/signup, and Firebase high-score storage.

## Live Demo

Play the deployed build here:

https://assignment02-112006269.web.app

## Project Info

- Course: Software Studio 2025 Spring
- Assignment: Assignment 02 - Web Canvas
- Student: Ariel Arella Sugandik
- Student ID: 112006269
- Engine: Cocos Creator 2.4.8
- Build target: Web / mobile browser
- Hosting: Firebase Hosting

## Gameplay

The game flow starts from authentication, moves into a menu / level selection scene, then loads the platforming level. The player moves through the map, collects coins, hits mystery blocks, avoids or stomps enemies, and tries to finish the level with the best score.

### Controls

| Action | Key |
| --- | --- |
| Move left | `A` or `Left Arrow` |
| Move right | `D` or `Right Arrow` |
| Jump | `Space` |
| Select menu / level | Mouse click / tap |

### Scoring

The final score is calculated from the remaining timer, collected score, coins, and remaining lives:

```text
finalScore = ceil(timer) * 100 + score + coin * 50 + life * 200
```

## Features

- Start menu, login/signup UI, level selection, gameplay scenes, win state, and game-over state
- Cocos Creator 2D physics with rigid bodies, colliders, and contact listeners
- Player movement, jumping, falling death, lives, rebirth, and power-up state
- Camera follow system with parallax background layers
- Static platforms, one-way platform behavior, walls, and Tiled map based levels
- Mystery blocks that spawn either coins or power-ups
- Enemy behavior for Goomba-style monsters and flower hazards
- Stomp-to-defeat enemy interaction
- Animations for idle, run, jump, stop, death, powered-up player, Goomba movement, Goomba death, coins, blocks, and power-ups
- UI for life, score, timer, coins, player name, and high score
- Background music and sound effects for jump, death, stomp, coin, power-up, power-down, game over, and level clear
- Firebase Authentication for signup/login
- Firebase Realtime Database profile and high-score updates
- Firebase Hosting deployment configuration

## Assignment Checklist

| Requirement | Implementation |
| --- | --- |
| Complete game process | Start/Login -> Menu/Level Select -> Game -> Win/Game Over |
| World map | Physics world, parallax background, camera following player |
| Level design | Tiled maps, static walls, platforms, mystery blocks |
| Player | Movement, jump, physics, damage, death, rebirth, power-up state |
| Enemies | Physics movement, direction switching, stomp death behavior |
| Mystery blocks | Coin and power-up spawning |
| Animations | Player, enemies, blocks, coins, power-ups |
| Sound effects | BGM and gameplay SFX |
| UI | Life, score, timer, coin, profile/high-score labels |
| Firebase | Signup/login, user profile, high-score update, deployed hosting |

## Project Structure

```text
.
|-- assets/
|   |-- audio/              # BGM and sound effects
|   |-- effects_UI_tiles/   # Tiles, UI, effects, and animations
|   |-- enemies/            # Enemy sprite sheets and plist files
|   |-- fonts/              # Bitmap fonts
|   |-- maps/               # Tiled map files
|   |-- pictures/           # Menu and UI images
|   |-- player/             # Player sprite sheets and animations
|   |-- Prefabs/            # Cocos prefabs
|   `-- script/             # Game scripts
|-- settings/               # Cocos Creator project settings
|-- web-mobile/             # Built web/mobile output
|-- firebase.json           # Firebase Hosting config
|-- .firebaserc             # Firebase project alias
|-- project.json            # Cocos Creator project metadata
`-- README.md
```

## Important Scripts

| Script | Purpose |
| --- | --- |
| `assets/script/Player.js` | Player controls, jumping, power-up state, death, win handling |
| `assets/script/GameManager.js` | Persistent life, score, timer, coin state, and final score calculation |
| `assets/script/firebase.js` | Firebase auth, profiles, and high-score updates |
| `assets/script/TITLE.js` | Login/signup UI flow |
| `assets/script/QBlock.js` | Mystery block coin/power-up logic |
| `assets/script/Goomba.js` | Enemy movement and stomp defeat animation |
| `assets/script/powerup.js` | Power-up movement and player upgrade trigger |
| `assets/script/camera.js` | Camera follow and parallax background movement |
| `assets/script/UIGame.js` | Rebinds UI labels to the persistent game manager |

## Run Locally

### Option 1: Run the built web version

Serve the `web-mobile` folder with any static file server:

```bash
cd web-mobile
python -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

### Option 2: Open in Cocos Creator

1. Install Cocos Creator 2.4.8.
2. Open this repository as a Cocos Creator project.
3. Use the editor preview to test the game.
4. Build to Web Mobile when exporting a new browser build.

## Deploy

This project is configured for Firebase Hosting with `web-mobile` as the public folder.

```bash
firebase login
firebase deploy --only hosting
```

## Notes

- The playable build is already included in `web-mobile`.
- Generated Cocos folders such as `library`, `local`, and `temp` are ignored by `.gitignore`.
- Firebase security depends on the project database rules, so review them before using the deployment outside of coursework.
