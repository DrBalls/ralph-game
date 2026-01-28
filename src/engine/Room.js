/**
 * Room class - Represents a location in the game world
 */
export class Room {
    /**
     * Create a new Room
     * @param {Object} config - Room configuration
     * @param {string} config.id - Unique identifier for the room
     * @param {string} config.name - Display name of the room
     * @param {string} config.description - Full description of the room
     * @param {Object} config.connections - Exits from this room {direction: roomId}
     * @param {boolean} config.locked - Whether the room is locked
     * @param {string} config.requiredKey - Item ID needed to unlock (if locked)
     */
    constructor(config) {
        this.id = config.id;
        this.name = config.name || 'Unknown Location';
        this.description = config.description || 'You see nothing special.';
        this.connections = config.connections || {};
        this.locked = config.locked || false;
        this.requiredKey = config.requiredKey || null;

        // Items present in this room
        this.items = config.items || [];

        // Characters present in this room
        this.characters = config.characters || [];

        // Additional room features that can be examined
        this.features = config.features || {};

        // Room state flags
        this.visited = false;
        this.state = config.state || {};
    }

    /**
     * Get the full description of the room including items and exits
     * @returns {string} The room description
     */
    getDescription() {
        let desc = this.description;

        // Add items description if there are visible items
        const visibleItems = this.items.filter(item => !item.hidden);
        if (visibleItems.length > 0) {
            const itemNames = visibleItems.map(item => item.name).join(', ');
            desc += `\n\nYou can see: ${itemNames}.`;
        }

        // Add characters description
        if (this.characters.length > 0) {
            const charNames = this.characters.map(char => char.name).join(', ');
            desc += `\n\n${charNames} ${this.characters.length === 1 ? 'is' : 'are'} here.`;
        }

        // Add exits
        const exits = this.getExits();
        if (exits.length > 0) {
            desc += `\n\nExits: ${exits.join(', ').toUpperCase()}`;
        }

        return desc;
    }

    /**
     * Get list of available exits from this room
     * @returns {string[]} Array of direction names
     */
    getExits() {
        return Object.keys(this.connections);
    }

    /**
     * Check if player can go in a direction
     * @param {string} direction - The direction to check
     * @returns {Object} Result with canGo boolean and message
     */
    canGo(direction) {
        const dir = direction.toLowerCase();

        // Check if exit exists
        if (!this.connections[dir]) {
            return {
                canGo: false,
                message: `You can't go ${direction} from here.`
            };
        }

        const connection = this.connections[dir];

        // Handle locked doors
        if (typeof connection === 'object' && connection.locked) {
            return {
                canGo: false,
                message: connection.lockedMessage || `The way ${direction} is locked.`,
                locked: true,
                requiredKey: connection.requiredKey
            };
        }

        return {
            canGo: true,
            roomId: typeof connection === 'string' ? connection : connection.roomId
        };
    }

    /**
     * Unlock a connection in a given direction
     * @param {string} direction - The direction to unlock
     * @returns {boolean} Whether unlock was successful
     */
    unlockDirection(direction) {
        const dir = direction.toLowerCase();
        const connection = this.connections[dir];

        if (typeof connection === 'object' && connection.locked) {
            connection.locked = false;
            return true;
        }
        return false;
    }

    /**
     * Add an item to the room
     * @param {Object} item - The item to add
     */
    addItem(item) {
        this.items.push(item);
    }

    /**
     * Remove an item from the room
     * @param {string} itemId - The ID of the item to remove
     * @returns {Object|null} The removed item, or null if not found
     */
    removeItem(itemId) {
        const index = this.items.findIndex(item => item.id === itemId);
        if (index !== -1) {
            return this.items.splice(index, 1)[0];
        }
        return null;
    }

    /**
     * Get an item from the room without removing it
     * @param {string} itemId - The ID of the item to get
     * @returns {Object|null} The item, or null if not found
     */
    getItem(itemId) {
        return this.items.find(item => item.id === itemId) || null;
    }

    /**
     * Check if room has a specific item
     * @param {string} itemId - The ID of the item to check
     * @returns {boolean} Whether the item is in the room
     */
    hasItem(itemId) {
        return this.items.some(item => item.id === itemId);
    }

    /**
     * Add a character to the room
     * @param {Object} character - The character to add
     */
    addCharacter(character) {
        this.characters.push(character);
    }

    /**
     * Remove a character from the room
     * @param {string} characterId - The ID of the character to remove
     * @returns {Object|null} The removed character, or null if not found
     */
    removeCharacter(characterId) {
        const index = this.characters.findIndex(char => char.id === characterId);
        if (index !== -1) {
            return this.characters.splice(index, 1)[0];
        }
        return null;
    }

    /**
     * Get a character from the room
     * @param {string} characterId - The ID of the character to get
     * @returns {Object|null} The character, or null if not found
     */
    getCharacter(characterId) {
        return this.characters.find(char => char.id === characterId) || null;
    }

    /**
     * Get a feature that can be examined
     * @param {string} featureName - The name of the feature
     * @returns {string|null} The feature description, or null if not found
     */
    getFeature(featureName) {
        const key = featureName.toLowerCase();
        return this.features[key] || null;
    }

    /**
     * Set a room state flag
     * @param {string} key - The state key
     * @param {*} value - The state value
     */
    setState(key, value) {
        this.state[key] = value;
    }

    /**
     * Get a room state flag
     * @param {string} key - The state key
     * @returns {*} The state value
     */
    getState(key) {
        return this.state[key];
    }

    /**
     * Mark the room as visited
     */
    markVisited() {
        this.visited = true;
    }
}
