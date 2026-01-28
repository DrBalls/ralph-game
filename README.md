# Cosmic Custodian: The Janitorial Frontier

*"In space, no one can hear you clean."*

A browser-based text adventure game in the style of classic Sierra and LucasArts games (Space Quest, Monkey Island). Play as **Zyx-7**, the last conscious janitor aboard the space station *Pristine Venture*, and save the crew using your mop, your wits, and 15 years of janitorial expertise.

## Playing the Game

Open `public/index.html` in any modern browser. No build step, server, or installation required.

```
# Clone and play
git clone https://github.com/DrBalls/ralph-game.git
cd ralph-game
open public/index.html
```

Or serve locally if your browser blocks ES module imports from `file://`:

```
npx serve public
```

## Story

The year is 2847. While you were cleaning a toilet in Cargo Bay 7, the alien artifact in the Science Lab activated and released a chaotic energy wave that:

1. Knocked out the entire crew (the toilet shielded you)
2. Corrupted the station AI, **DUSTY**
3. Set the station on a collision course with the Blorgnax Homeworld

Armed only with your mop, you must wake the crew, repair DUSTY, and redirect the station before it's too late.

## Commands

| Command | Description |
|---------|-------------|
| `LOOK` | Examine your surroundings |
| `LOOK AT` / `EXAMINE` *thing* | Inspect something closely |
| `TAKE` / `GET` *item* | Pick up an item |
| `DROP` *item* | Put down an item |
| `USE` *item* | Use an item by itself |
| `USE` *item* `WITH`/`ON` *target* | Use an item with something |
| `GO` *direction* | Move (or just type `N`, `S`, `E`, `W`, `UP`, `DOWN`) |
| `TALK TO` *character* | Speak with someone |
| `INVENTORY` (or `I`) | Check what you're carrying |
| `OPEN` / `CLOSE` *thing* | Open or close something |
| `PUSH` / `PULL` *thing* | Push or pull something |
| `READ` *thing* | Read something |
| `SAVE` / `LOAD` *1-3* | Save or load your game (uses localStorage) |
| `HELP` | Show available commands |

## Features

- **16 locations** with unique VGA-style pixel art
- **23 interactive items** with detailed examination text
- **12 puzzles** forming a logical chain from start to finish
- **6 characters** including a sarcastic AI and a pompous captain
- **200-point scoring system** tracking puzzle completion
- **Save/load** with 3 save slots via localStorage
- **Humor** throughout — every room, item, and interaction has personality

## Game Map

```
DUSTY's Core ── Bridge                Captain's Quarters
                  |                          |
   Ballroom ── MAIN CORRIDOR ── Medical Bay  |
                  |                   Maintenance Tunnels
        +---------+---------+                |
      (west)   (up/dn)   (south)      Engineering Deck
        |       |    |       |               |
  Eng. Corridor |    |  Cargo Corridor ── Crew Quarters
   |       |    |    |       |
Airlock    |  Mess  Sci Lab  |
           |  Hall  Corridor Cargo Bay 7 [START]
    (see above)  |
                 Science Lab
```

**Main Corridor** is the central hub with seven exits: Bridge (north), Medical Bay (east), Engineering Corridor (west), Mess Hall (up), Science Lab Corridor (down), Ballroom (northeast), and Cargo Corridor (south). Engineering Deck connects north to Maintenance Tunnels, which lead to the Captain's Quarters.

## Walkthrough

See [WALKTHROUGH.md](WALKTHROUGH.md) for a complete guide with step-by-step solutions, item locations, and scoring breakdown.

## Technical Details

- **Platform:** Browser (any modern browser on any OS)
- **Tech stack:** Vanilla HTML, CSS, JavaScript (ES6 modules)
- **Dependencies:** None
- **Build step:** None
- **Graphics:** 16 VGA-style pixel art images (640x400 PNG)
- **Save system:** Browser localStorage
- **Source layout:**

```
src/
  engine/     Game.js, Parser.js, GameState.js, Room.js, Item.js,
              Inventory.js, Character.js
  data/       rooms.js, items.js, characters.js, puzzles.js
  ui/         GameUI.js
public/
  index.html, game.js, styles.css, images/
```

## Credits

Created by Ralph Autonomous Agent, powered by Claude AI.
