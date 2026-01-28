/**
 * Inventory class - Manages the player's carried items
 */
export class Inventory {
    /**
     * Create a new Inventory
     * @param {Object} config - Inventory configuration
     * @param {number} config.maxSize - Maximum number of items (0 = unlimited)
     */
    constructor(config = {}) {
        this.items = [];
        this.maxSize = config.maxSize || 0; // 0 means unlimited
    }

    /**
     * Add an item to the inventory
     * @param {Object} item - The item to add
     * @returns {Object} Result with success boolean and message
     */
    add(item) {
        // Check capacity
        if (this.maxSize > 0 && this.items.length >= this.maxSize) {
            return {
                success: false,
                message: "Your inventory is full. You'll need to drop something first."
            };
        }

        // Check if already have this item
        if (this.has(item.id)) {
            return {
                success: false,
                message: `You already have the ${item.name}.`
            };
        }

        this.items.push(item);
        return {
            success: true,
            message: `You take the ${item.name}.`
        };
    }

    /**
     * Remove an item from the inventory
     * @param {string} itemId - The ID of the item to remove
     * @returns {Object|null} The removed item, or null if not found
     */
    remove(itemId) {
        const index = this.items.findIndex(item => item.id === itemId);
        if (index !== -1) {
            return this.items.splice(index, 1)[0];
        }
        return null;
    }

    /**
     * Check if inventory contains an item
     * @param {string} itemId - The ID of the item to check
     * @returns {boolean} Whether the item is in the inventory
     */
    has(itemId) {
        return this.items.some(item => item.id === itemId);
    }

    /**
     * Get list of item names in the inventory
     * @returns {string[]} Array of item names
     */
    list() {
        return this.items.map(item => item.name);
    }

    /**
     * Get an item from the inventory without removing it
     * @param {string} itemId - The ID of the item to get
     * @returns {Object|null} The item, or null if not found
     */
    getItem(itemId) {
        return this.items.find(item => item.id === itemId) || null;
    }

    /**
     * Find an item by name (including aliases)
     * @param {string} name - The name to search for
     * @returns {Object|null} The matching item, or null if not found
     */
    findByName(name) {
        const lowerName = name.toLowerCase();
        return this.items.find(item => {
            if (item.name.toLowerCase() === lowerName) return true;
            if (item.id.toLowerCase() === lowerName) return true;
            if (item.matchesName && item.matchesName(lowerName)) return true;
            return false;
        }) || null;
    }

    /**
     * Get formatted string of inventory contents
     * @returns {string} Formatted inventory string
     */
    getDisplayString() {
        if (this.items.length === 0) {
            return "You are carrying nothing.";
        }
        const names = this.list();
        return `You are carrying: ${names.join(', ')}.`;
    }

    /**
     * Get the number of items in inventory
     * @returns {number} Number of items
     */
    count() {
        return this.items.length;
    }

    /**
     * Check if inventory is empty
     * @returns {boolean} Whether inventory is empty
     */
    isEmpty() {
        return this.items.length === 0;
    }

    /**
     * Check if inventory is full
     * @returns {boolean} Whether inventory is at capacity
     */
    isFull() {
        return this.maxSize > 0 && this.items.length >= this.maxSize;
    }

    /**
     * Clear all items from inventory
     * @returns {Object[]} Array of removed items
     */
    clear() {
        const items = [...this.items];
        this.items = [];
        return items;
    }

    /**
     * Get all items (for serialization)
     * @returns {Object[]} Array of items
     */
    getAllItems() {
        return [...this.items];
    }

    /**
     * Set items directly (for loading saved games)
     * @param {Object[]} items - Array of items to set
     */
    setItems(items) {
        this.items = [...items];
    }
}
