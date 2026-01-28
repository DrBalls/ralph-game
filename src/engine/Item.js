/**
 * Item class - Represents an interactive object in the game
 */
export class Item {
    /**
     * Create a new Item
     * @param {Object} config - Item configuration
     * @param {string} config.id - Unique identifier for the item
     * @param {string} config.name - Display name of the item
     * @param {string} config.description - Brief description shown in room
     * @param {string} config.examineText - Detailed description when examined
     * @param {boolean} config.takeable - Whether player can pick up this item
     * @param {string[]} config.useWith - Array of item/target IDs this can be used with
     * @param {string} config.cantTakeMessage - Message shown when trying to take non-takeable item
     * @param {boolean} config.hidden - Whether item is hidden from room description
     */
    constructor(config) {
        this.id = config.id;
        this.name = config.name || 'Unknown Item';
        this.description = config.description || 'An item.';
        this.examineText = config.examineText || config.description || 'Nothing special about it.';
        this.takeable = config.takeable !== undefined ? config.takeable : true;
        this.useWith = config.useWith || [];
        this.cantTakeMessage = config.cantTakeMessage || "You can't take that.";
        this.hidden = config.hidden || false;

        // Item state
        this.state = config.state || {};

        // Custom handlers (can be set by game logic)
        this._onUse = config.onUse || null;
        this._onTake = config.onTake || null;
        this._onDrop = config.onDrop || null;
        this._onExamine = config.onExamine || null;

        // Aliases for the item (alternative names players might use)
        this.aliases = config.aliases || [];
    }

    /**
     * Get detailed description of the item
     * @param {Object} gameState - Current game state for dynamic descriptions
     * @returns {string} The examination text
     */
    examine(gameState = null) {
        // If there's a custom examine handler, use it
        if (this._onExamine) {
            const result = this._onExamine(this, gameState);
            if (result) return result;
        }
        return this.examineText;
    }

    /**
     * Use this item, optionally with a target
     * @param {Object|null} target - The target item, character, or feature
     * @param {Object} gameState - Current game state
     * @returns {Object} Result with success boolean and message
     */
    onUse(target = null, gameState = null) {
        // If there's a custom use handler, use it
        if (this._onUse) {
            return this._onUse(this, target, gameState);
        }

        // Default behavior - check if this item can be used with target
        if (target) {
            const targetId = target.id || target;
            if (this.useWith.includes(targetId)) {
                return {
                    success: true,
                    message: `You use the ${this.name} with the ${target.name || target}.`
                };
            }
            return {
                success: false,
                message: `You can't use the ${this.name} with that.`
            };
        }

        return {
            success: false,
            message: `You're not sure how to use the ${this.name} by itself.`
        };
    }

    /**
     * Called when player takes this item
     * @param {Object} gameState - Current game state
     * @returns {Object} Result with success boolean and message
     */
    onTake(gameState = null) {
        if (!this.takeable) {
            return {
                success: false,
                message: this.cantTakeMessage
            };
        }

        // If there's a custom take handler, use it
        if (this._onTake) {
            return this._onTake(this, gameState);
        }

        return {
            success: true,
            message: `You take the ${this.name}.`
        };
    }

    /**
     * Called when player drops this item
     * @param {Object} gameState - Current game state
     * @returns {Object} Result with success boolean and message
     */
    onDrop(gameState = null) {
        // If there's a custom drop handler, use it
        if (this._onDrop) {
            return this._onDrop(this, gameState);
        }

        return {
            success: true,
            message: `You drop the ${this.name}.`
        };
    }

    /**
     * Check if a name matches this item (including aliases)
     * @param {string} name - The name to check
     * @returns {boolean} Whether the name matches
     */
    matchesName(name) {
        const lowerName = name.toLowerCase();
        if (this.name.toLowerCase() === lowerName) return true;
        if (this.id.toLowerCase() === lowerName) return true;
        return this.aliases.some(alias => alias.toLowerCase() === lowerName);
    }

    /**
     * Set a custom use handler
     * @param {Function} handler - Function(item, target, gameState) => {success, message}
     */
    setUseHandler(handler) {
        this._onUse = handler;
    }

    /**
     * Set a custom take handler
     * @param {Function} handler - Function(item, gameState) => {success, message}
     */
    setTakeHandler(handler) {
        this._onTake = handler;
    }

    /**
     * Set a custom drop handler
     * @param {Function} handler - Function(item, gameState) => {success, message}
     */
    setDropHandler(handler) {
        this._onDrop = handler;
    }

    /**
     * Set a custom examine handler
     * @param {Function} handler - Function(item, gameState) => string|null
     */
    setExamineHandler(handler) {
        this._onExamine = handler;
    }

    /**
     * Set item state
     * @param {string} key - State key
     * @param {*} value - State value
     */
    setState(key, value) {
        this.state[key] = value;
    }

    /**
     * Get item state
     * @param {string} key - State key
     * @returns {*} State value
     */
    getState(key) {
        return this.state[key];
    }

    /**
     * Check if item can be used with a specific target
     * @param {string} targetId - The target ID to check
     * @returns {boolean} Whether item can be used with target
     */
    canUseWith(targetId) {
        return this.useWith.includes(targetId);
    }

    /**
     * Add a target this item can be used with
     * @param {string} targetId - The target ID to add
     */
    addUseWith(targetId) {
        if (!this.useWith.includes(targetId)) {
            this.useWith.push(targetId);
        }
    }

    /**
     * Show/hide the item
     * @param {boolean} hidden - Whether to hide the item
     */
    setHidden(hidden) {
        this.hidden = hidden;
    }
}
