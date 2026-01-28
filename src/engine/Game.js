/**
 * Game class - Main game controller that ties all components together
 */
import { Parser } from './Parser.js';
import { GameState } from './GameState.js';
import { Room } from './Room.js';
import { Item } from './Item.js';
import { Character } from './Character.js';

export class Game {
    /**
     * Create a new Game instance
     * @param {Object} config - Game configuration
     * @param {Function} config.outputCallback - Function to display text to player
     * @param {Object} config.roomData - Room definitions
     * @param {Object} config.itemData - Item definitions
     * @param {string} config.startingRoom - Starting room ID
     */
    constructor(config = {}) {
        this.outputCallback = config.outputCallback || console.log;
        this.parser = new Parser();
        this.state = new GameState({
            startingRoom: config.startingRoom || 'cargo-bay-7'
        });

        // Store rooms and items
        this.rooms = new Map();
        this.items = new Map();
        this.characters = new Map();

        // Initialize data if provided
        if (config.roomData) {
            this.initRooms(config.roomData);
        }
        if (config.itemData) {
            this.initItems(config.itemData);
        }
        if (config.characterData) {
            this.initCharacters(config.characterData);
        }

        // Game running state
        this.isRunning = false;
        this.gameOver = false;
    }

    /**
     * Initialize rooms from data
     * @param {Object} roomData - Room definitions
     */
    initRooms(roomData) {
        for (const [id, data] of Object.entries(roomData)) {
            const room = new Room({ id, ...data });
            this.rooms.set(id, room);
        }
    }

    /**
     * Initialize items from data
     * @param {Object} itemData - Item definitions
     */
    initItems(itemData) {
        for (const [id, data] of Object.entries(itemData)) {
            const item = new Item({ id, ...data });
            this.items.set(id, item);

            // Place item in its starting room if specified
            if (data.startingRoom) {
                const room = this.rooms.get(data.startingRoom);
                if (room) {
                    room.addItem(item);
                }
            }
        }
    }

    /**
     * Initialize characters from data
     * @param {Object} characterData - Character definitions
     */
    initCharacters(characterData) {
        for (const [id, data] of Object.entries(characterData)) {
            const character = new Character({ id, ...data });
            this.characters.set(id, character);

            // Place character in their starting room if specified
            if (data.startingRoom) {
                const room = this.rooms.get(data.startingRoom);
                if (room) {
                    room.addCharacter(character);
                }
            }
        }
    }

    /**
     * Output text to the player
     * @param {string} text - Text to display
     * @param {string} className - Optional CSS class for styling
     */
    output(text, className = '') {
        this.outputCallback(text, className);
    }

    /**
     * Get the current room
     * @returns {Room|null} Current room or null
     */
    getCurrentRoom() {
        return this.rooms.get(this.state.getCurrentRoomId()) || null;
    }

    /**
     * Start the game
     */
    start() {
        this.isRunning = true;
        this.output('═══════════════════════════════════════════', 'system');
        this.output('Welcome to COSMIC CUSTODIAN: The Janitorial Frontier', 'room-title');
        this.output('═══════════════════════════════════════════', 'system');
        this.output('');
        this.handleLook();
    }

    /**
     * Handle a player command
     * @param {string} input - Raw command string
     * @returns {Object} Result of command execution
     */
    handleCommand(input) {
        if (!this.isRunning) {
            return { success: false, message: 'Game not started.' };
        }

        if (this.gameOver) {
            return { success: false, message: 'The game is over. Type QUIT to exit.' };
        }

        // Parse the command
        const command = this.parser.parse(input);

        // Handle parse errors
        if (command.error && !command.verb) {
            this.output(command.error, 'error');
            return { success: false, message: command.error };
        }

        // Execute the command
        const result = this.executeCommand(command);

        return result;
    }

    /**
     * Execute a parsed command
     * @param {Object} command - Parsed command object
     * @returns {Object} Result of execution
     */
    executeCommand(command) {
        const { verb, noun, target } = command;

        // Check for game win condition after each command
        if (this.state.getFlag('game_won') && !this.state.getFlag('ending_shown')) {
            this.state.setFlag('ending_shown', true);
            this.showEnding();
            return { success: true };
        }

        switch (verb) {
            case 'look':
                return noun ? this.handleExamine(noun) : this.handleLook();

            case 'examine':
                return this.handleExamine(noun);

            case 'take':
                return this.handleTake(noun);

            case 'drop':
                return this.handleDrop(noun);

            case 'use':
                return this.handleUse(noun, target);

            case 'go':
                return this.handleGo(noun);

            case 'inventory':
                return this.handleInventory();

            case 'talk':
                return this.handleTalk(noun);

            case 'open':
                return this.handleOpen(noun);

            case 'close':
                return this.handleClose(noun);

            case 'read':
                return this.handleRead(noun);

            case 'push':
            case 'pull':
                return this.handlePushPull(verb, noun);

            case 'help':
                return this.handleHelp();

            case 'save':
                return this.handleSave(noun);

            case 'load':
                return this.handleLoad(noun);

            case 'quit':
                return this.handleQuit();

            default:
                this.output("I don't understand that command. Type HELP for available commands.", 'error');
                return { success: false, message: 'Unknown command' };
        }
    }

    /**
     * Handle LOOK command (look at room)
     */
    handleLook() {
        const room = this.getCurrentRoom();
        if (!room) {
            this.output("You are nowhere. This shouldn't happen.", 'error');
            return { success: false };
        }

        room.markVisited();
        this.output(room.name, 'room-title');
        this.output(room.getDescription(), 'description');

        return { success: true };
    }

    /**
     * Handle EXAMINE command
     * @param {string} noun - Thing to examine
     */
    handleExamine(noun) {
        if (!noun) {
            this.output('Examine what?', 'error');
            return { success: false };
        }

        const room = this.getCurrentRoom();

        // Check inventory first
        const invItem = this.state.inventory.findByName(noun);
        if (invItem) {
            this.output(invItem.examine(this.state), 'description');
            return { success: true };
        }

        // Check room items
        const roomItem = room.items.find(item => item.matchesName(noun));
        if (roomItem) {
            this.output(roomItem.examine(this.state), 'description');
            return { success: true };
        }

        // Check room features
        const feature = room.getFeature(noun);
        if (feature) {
            this.output(feature, 'description');
            return { success: true };
        }

        // Check characters
        const char = room.characters.find(c => c.matchesName(noun));
        if (char) {
            this.output(char.description || `You see ${char.name}.`, 'description');
            return { success: true };
        }

        this.output(`You don't see any "${noun}" here.`, 'error');
        return { success: false };
    }

    /**
     * Handle TAKE command
     * @param {string} noun - Item to take
     */
    handleTake(noun) {
        if (!noun) {
            this.output('Take what?', 'error');
            return { success: false };
        }

        const room = this.getCurrentRoom();
        const item = room.items.find(i => i.matchesName(noun));

        if (!item) {
            this.output(`You don't see any "${noun}" here.`, 'error');
            return { success: false };
        }

        // Check if item can be taken
        const takeResult = item.onTake(this.state);
        if (!takeResult.success) {
            this.output(takeResult.message, 'error');
            return { success: false };
        }

        // Add to inventory and remove from room
        const addResult = this.state.inventory.add(item);
        if (addResult.success) {
            room.removeItem(item.id);
            this.output(takeResult.message || `You take the ${item.name}.`, 'success');
            return { success: true };
        } else {
            this.output(addResult.message, 'error');
            return { success: false };
        }
    }

    /**
     * Handle DROP command
     * @param {string} noun - Item to drop
     */
    handleDrop(noun) {
        if (!noun) {
            this.output('Drop what?', 'error');
            return { success: false };
        }

        const item = this.state.inventory.findByName(noun);
        if (!item) {
            this.output(`You're not carrying any "${noun}".`, 'error');
            return { success: false };
        }

        const dropResult = item.onDrop(this.state);
        if (!dropResult.success) {
            this.output(dropResult.message, 'error');
            return { success: false };
        }

        this.state.inventory.remove(item.id);
        this.getCurrentRoom().addItem(item);
        this.output(dropResult.message || `You drop the ${item.name}.`, 'success');
        return { success: true };
    }

    /**
     * Handle USE command
     * @param {string} noun - Item to use
     * @param {string} target - Optional target
     */
    handleUse(noun, target) {
        if (!noun) {
            this.output('Use what?', 'error');
            return { success: false };
        }

        // Find the item (in inventory or room)
        let item = this.state.inventory.findByName(noun);
        if (!item) {
            const room = this.getCurrentRoom();
            item = room.items.find(i => i.matchesName(noun));
        }

        if (!item) {
            this.output(`You don't have any "${noun}".`, 'error');
            return { success: false };
        }

        // Find the target if specified
        let targetObj = null;
        if (target) {
            // Check inventory
            targetObj = this.state.inventory.findByName(target);
            if (!targetObj) {
                // Check room items
                const room = this.getCurrentRoom();
                targetObj = room.items.find(i => i.matchesName(target));
            }
            if (!targetObj) {
                // Check room features
                const room = this.getCurrentRoom();
                if (room.getFeature(target)) {
                    targetObj = { id: target, name: target };
                }
            }
            if (!targetObj) {
                // Check characters
                const room = this.getCurrentRoom();
                targetObj = room.characters.find(c => c.matchesName(target));
            }
        }

        const result = item.onUse(targetObj, this.state);
        this.output(result.message, result.success ? 'success' : 'error');
        return result;
    }

    /**
     * Handle GO command
     * @param {string} direction - Direction to go
     */
    handleGo(direction) {
        if (!direction) {
            this.output('Go where?', 'error');
            return { success: false };
        }

        const room = this.getCurrentRoom();
        const result = room.canGo(direction);

        if (!result.canGo) {
            this.output(result.message, 'error');
            return { success: false, locked: result.locked };
        }

        // Move to new room
        this.state.setCurrentRoom(result.roomId);
        this.handleLook();
        return { success: true };
    }

    /**
     * Handle INVENTORY command
     */
    handleInventory() {
        this.output(this.state.inventory.getDisplayString(), 'description');
        return { success: true };
    }

    /**
     * Handle TALK command
     * @param {string} noun - Character to talk to
     */
    handleTalk(noun) {
        if (!noun) {
            this.output('Talk to whom?', 'error');
            return { success: false };
        }

        const room = this.getCurrentRoom();
        const char = room.characters.find(c => c.matchesName(noun));

        if (!char) {
            this.output(`There's no "${noun}" here to talk to.`, 'error');
            return { success: false };
        }

        if (char.talk) {
            const dialogue = char.talk(this.state);
            this.output(dialogue, 'dialogue');
            return { success: true };
        } else {
            this.output(`${char.name} has nothing to say.`, 'description');
            return { success: true };
        }
    }

    /**
     * Handle OPEN command
     * @param {string} noun - Thing to open
     */
    handleOpen(noun) {
        this.output(`You can't open the ${noun || 'that'}.`, 'error');
        return { success: false };
    }

    /**
     * Handle CLOSE command
     * @param {string} noun - Thing to close
     */
    handleClose(noun) {
        this.output(`You can't close the ${noun || 'that'}.`, 'error');
        return { success: false };
    }

    /**
     * Handle READ command
     * @param {string} noun - Thing to read
     */
    handleRead(noun) {
        if (!noun) {
            this.output('Read what?', 'error');
            return { success: false };
        }

        // Find the item (in inventory or room)
        let item = this.state.inventory.findByName(noun);
        if (!item) {
            const room = this.getCurrentRoom();
            item = room.items.find(i => i.matchesName(noun));
        }

        if (!item) {
            this.output(`You don't see any "${noun}" to read.`, 'error');
            return { success: false };
        }

        // If item has a use handler (like the poetry book), trigger it
        if (item._onUse) {
            return this.handleUse(noun, null);
        }

        // Otherwise, just examine it
        return this.handleExamine(noun);
    }

    /**
     * Handle PUSH/PULL commands
     * @param {string} verb - push or pull
     * @param {string} noun - Thing to push/pull
     */
    handlePushPull(verb, noun) {
        this.output(`You ${verb} the ${noun || 'thing'}, but nothing happens.`, 'description');
        return { success: false };
    }

    /**
     * Handle HELP command
     */
    handleHelp() {
        this.output(this.parser.getHelpText(), 'description');
        return { success: true };
    }

    /**
     * Handle SAVE command
     * @param {string} slotStr - Save slot (1-3)
     */
    handleSave(slotStr) {
        const slot = parseInt(slotStr) || 1;
        if (slot < 1 || slot > 3) {
            this.output('Please specify a slot from 1 to 3.', 'error');
            return { success: false };
        }
        const result = this.state.save(slot);
        this.output(result.message, result.success ? 'success' : 'error');
        return result;
    }

    /**
     * Handle LOAD command
     * @param {string} slotStr - Save slot (1-3)
     */
    handleLoad(slotStr) {
        const slot = parseInt(slotStr) || 1;
        if (slot < 1 || slot > 3) {
            this.output('Please specify a slot from 1 to 3.', 'error');
            return { success: false };
        }
        const result = this.state.load(slot, (id) => this.items.get(id));
        if (result.success) {
            this.output(result.message, 'success');
            this.handleLook();
        } else {
            this.output(result.message, 'error');
        }
        return result;
    }

    /**
     * Handle QUIT command
     */
    handleQuit() {
        this.output('Thanks for playing COSMIC CUSTODIAN!', 'system');
        this.output(`Final score: ${this.state.getScore()} / ${this.state.maxScore}`, 'system');
        this.output(`Moves: ${this.state.getMoveCount()}`, 'system');
        this.output(`Time: ${this.state.getFormattedTime()}`, 'system');
        this.isRunning = false;
        return { success: true };
    }

    /**
     * End the game (victory or defeat)
     * @param {boolean} victory - Whether player won
     * @param {string} message - End message
     */
    endGame(victory, message) {
        this.gameOver = true;
        this.output('═══════════════════════════════════════════', 'system');
        this.output(victory ? 'CONGRATULATIONS!' : 'GAME OVER', 'room-title');
        this.output('═══════════════════════════════════════════', 'system');
        this.output(message, 'description');
        this.output('');
        this.output(`Final score: ${this.state.getScore()} / ${this.state.maxScore}`, 'system');
        this.output(`Moves: ${this.state.getMoveCount()}`, 'system');
        this.output(`Time: ${this.state.getFormattedTime()}`, 'system');
    }

    /**
     * Show the game ending sequence
     */
    showEnding() {
        this.output('', 'description');
        this.output('═══════════════════════════════════════════', 'system');
        this.output('═══════════════════════════════════════════', 'system');
        this.output('', 'description');

        this.output(`The hours that follow are a blur of activity.`, 'description');
        this.output('', 'description');

        this.output(`One by one, the crew members begin to wake up. First the groans, then the confusion, then the inevitable "What happened?" questions that you answer with increasingly creative non-answers.`, 'description');
        this.output('', 'description');

        this.output(`Captain Bluster is among the last to regain consciousness. He sits up in his command chair, smooths his hair, and immediately demands a situation report.`, 'description');
        this.output('', 'description');

        this.output(`"Sir," you begin, "the station was on a collision course with Blorgnax Prime. The AI was corrupted. I had to-"`, 'description');
        this.output('', 'description');

        this.output(`"Yes, yes," the Captain waves his hand dismissively. "I'm sure I handled it brilliantly. My tactical genius saved us all, no doubt. Make a note of that for my commendation file."`, 'description');
        this.output('', 'description');

        this.output(`You open your mouth to correct him, then close it again. Some battles aren't worth fighting.`, 'description');
        this.output('', 'description');

        this.output(`"Also," the Captain continues, "this hero mop of yours." He gestures at your trusty cleaning companion. "It's looking a bit worn. Have Engineering issue you a replacement."`, 'description');
        this.output('', 'description');

        this.output(`A week later, a small package arrives at your quarters.`, 'description');
        this.output('', 'description');

        this.output(`Inside is a brand new mop - the Mark II Janitorial Companion, top of the line. The handle is reinforced titanium. The head is made of some kind of self-cleaning nano-fiber. There's even a cup holder.`, 'description');
        this.output('', 'description');

        this.output(`Attached is a note: "For services rendered to the station. - DUSTY"`, 'description');
        this.output('', 'description');

        this.output(`Underneath, in smaller text: "Don't tell anyone I did something nice. I have a reputation to maintain."`, 'description');
        this.output('', 'description');

        this.output(`You smile. Your old mop served you well, but change isn't always bad.`, 'description');
        this.output('', 'description');

        this.output(`After all, you've got a lot of cleaning to do. There's alien goo in the corridors, mirror shards in the ballroom, and someone needs to deal with whatever's living in that bucket.`, 'description');
        this.output('', 'description');

        this.output(`Just another day on the Pristine Venture.`, 'description');
        this.output('', 'description');

        this.output('═══════════════════════════════════════════', 'system');
        this.output('                    THE END', 'room-title');
        this.output('═══════════════════════════════════════════', 'system');
        this.output('', 'description');

        this.output('COSMIC CUSTODIAN: The Janitorial Frontier', 'room-title');
        this.output('', 'description');

        this.output('CREDITS', 'system');
        this.output('─────────────────────────────────────────────', 'system');
        this.output('', 'description');
        this.output('Created by: Ralph Autonomous Agent', 'description');
        this.output('Powered by: Claude AI', 'description');
        this.output('Mop Consultant: You (probably)', 'description');
        this.output('', 'description');

        this.output('SPECIAL THANKS TO:', 'system');
        this.output('─────────────────────────────────────────────', 'system');
        this.output('- The toilet that saved your life', 'description');
        this.output('- Your trusty mop (both versions)', 'description');
        this.output('- Duct tape, the universal solution', 'description');
        this.output('- Chief Krix, for not waking up and yelling at you', 'description');
        this.output('- The alien artifact, for eventually being helpful', 'description');
        this.output('- DUSTY, for the sarcasm and the new mop', 'description');
        this.output('- Jenkins, for taking the blame for everything', 'description');
        this.output('', 'description');

        this.output('NO JANITORS WERE HARMED IN THE MAKING OF THIS GAME', 'system');
        this.output('(The mop took some damage, though)', 'description');
        this.output('', 'description');

        this.output('═══════════════════════════════════════════', 'system');
        this.output('', 'description');
        this.output(`Final Score: ${this.state.getScore()} / ${this.state.maxScore}`, 'system');
        this.output(`Total Moves: ${this.state.getMoveCount()}`, 'system');
        this.output(`Play Time: ${this.state.getFormattedTime()}`, 'system');
        this.output('', 'description');
        this.output('Thank you for playing!', 'room-title');

        this.gameOver = true;
    }

    /**
     * Get an item by ID (for save/load)
     * @param {string} id - Item ID
     * @returns {Item|null} The item or null
     */
    getItemById(id) {
        return this.items.get(id) || null;
    }

    /**
     * Get a room by ID
     * @param {string} id - Room ID
     * @returns {Room|null} The room or null
     */
    getRoomById(id) {
        return this.rooms.get(id) || null;
    }
}
