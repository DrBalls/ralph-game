/**
 * Character class - Represents an NPC in the game
 */
export class Character {
    /**
     * Create a new Character
     * @param {Object} config - Character configuration
     * @param {string} config.id - Unique identifier
     * @param {string} config.name - Display name
     * @param {string} config.description - Description when examined
     * @param {Object} config.dialogue - Dialogue tree object
     * @param {string} config.state - Current character state
     */
    constructor(config) {
        this.id = config.id;
        this.name = config.name || 'Unknown';
        this.description = config.description || 'Someone is here.';
        this.dialogue = config.dialogue || {};
        this.state = config.state || 'default';
        this.startingRoom = config.startingRoom || null;

        // Items the character can give
        this.inventory = config.inventory || [];

        // Custom handlers
        this._onTalk = config.onTalk || null;
        this._onGive = config.onGive || null;
    }

    /**
     * Get dialogue for current state
     * @param {Object} gameState - Current game state
     * @returns {string} The dialogue text
     */
    talk(gameState = null) {
        // Use custom talk handler if set
        if (this._onTalk) {
            const result = this._onTalk(this, gameState);
            if (result) return result;
        }

        // Get dialogue for current state
        const stateDialogue = this.dialogue[this.state];
        if (stateDialogue) {
            // Handle both string and array dialogue
            if (Array.isArray(stateDialogue)) {
                // Random selection from array
                return stateDialogue[Math.floor(Math.random() * stateDialogue.length)];
            }
            return stateDialogue;
        }

        // Default dialogue
        return this.dialogue.default || `${this.name} has nothing to say.`;
    }

    /**
     * Give an item to the player
     * @param {string} itemId - ID of item to give
     * @param {Object} gameState - Game state for inventory access
     * @returns {Object} Result with success and message
     */
    giveItem(itemId, gameState) {
        const itemIndex = this.inventory.findIndex(i => i.id === itemId || i === itemId);
        if (itemIndex === -1) {
            return {
                success: false,
                message: `${this.name} doesn't have that to give.`
            };
        }

        const item = this.inventory.splice(itemIndex, 1)[0];

        // Use custom give handler if set
        if (this._onGive) {
            return this._onGive(this, item, gameState);
        }

        return {
            success: true,
            item: item,
            message: `${this.name} gives you the ${item.name || itemId}.`
        };
    }

    /**
     * Set character state (affects dialogue)
     * @param {string} newState - New state name
     */
    setState(newState) {
        this.state = newState;
    }

    /**
     * Get current state
     * @returns {string} Current state
     */
    getState() {
        return this.state;
    }

    /**
     * Set custom talk handler
     * @param {Function} handler - Function(character, gameState) => string
     */
    setTalkHandler(handler) {
        this._onTalk = handler;
    }

    /**
     * Set custom give handler
     * @param {Function} handler - Function(character, item, gameState) => {success, message}
     */
    setGiveHandler(handler) {
        this._onGive = handler;
    }

    /**
     * Check if name matches this character
     * @param {string} name - Name to check
     * @returns {boolean} Whether name matches
     */
    matchesName(name) {
        const lowerName = name.toLowerCase();
        return this.name.toLowerCase().includes(lowerName) ||
               this.id.toLowerCase() === lowerName;
    }

    /**
     * Add item to character's inventory
     * @param {Object} item - Item to add
     */
    addItem(item) {
        this.inventory.push(item);
    }

    /**
     * Check if character has an item
     * @param {string} itemId - Item ID to check
     * @returns {boolean} Whether character has item
     */
    hasItem(itemId) {
        return this.inventory.some(i => i.id === itemId || i === itemId);
    }
}

export default Character;
