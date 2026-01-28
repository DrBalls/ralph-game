/**
 * GameState class - Manages overall game state and progress
 */
import { Inventory } from './Inventory.js';

export class GameState {
    /**
     * Create a new GameState
     * @param {Object} config - Initial configuration
     * @param {string} config.startingRoom - ID of the starting room
     * @param {number} config.maxInventory - Max inventory size (0 = unlimited)
     */
    constructor(config = {}) {
        // Current room ID
        this.currentRoomId = config.startingRoom || 'cargo-bay-7';

        // Player inventory
        this.inventory = new Inventory({ maxSize: config.maxInventory || 0 });

        // Puzzle and game state flags
        this.flags = {};

        // Game statistics
        this.moveCount = 0;
        this.startTime = Date.now();
        this.score = 0;
        this.maxScore = config.maxScore || 200;

        // Rooms reference (will be set by Game class)
        this.rooms = null;

        // Save slot name prefix
        this.savePrefix = 'cosmic-custodian-save-';
    }

    /**
     * Get the current room ID
     * @returns {string} Current room ID
     */
    getCurrentRoomId() {
        return this.currentRoomId;
    }

    /**
     * Set the current room
     * @param {string} roomId - The room ID to move to
     */
    setCurrentRoom(roomId) {
        this.currentRoomId = roomId;
        this.moveCount++;
    }

    /**
     * Set a game flag
     * @param {string} name - Flag name
     * @param {*} value - Flag value
     */
    setFlag(name, value) {
        this.flags[name] = value;
    }

    /**
     * Get a game flag
     * @param {string} name - Flag name
     * @param {*} defaultValue - Default value if flag not set
     * @returns {*} Flag value
     */
    getFlag(name, defaultValue = false) {
        return this.flags.hasOwnProperty(name) ? this.flags[name] : defaultValue;
    }

    /**
     * Check if a flag is set (truthy)
     * @param {string} name - Flag name
     * @returns {boolean} Whether flag is truthy
     */
    hasFlag(name) {
        return !!this.flags[name];
    }

    /**
     * Add to the player's score
     * @param {number} points - Points to add
     * @param {string} reason - Optional reason for points (for tracking)
     * @returns {number} New score total
     */
    addScore(points, reason = '') {
        this.score += points;
        if (reason) {
            this.setFlag(`scored_${reason}`, true);
        }
        return this.score;
    }

    /**
     * Get the current score
     * @returns {number} Current score
     */
    getScore() {
        return this.score;
    }

    /**
     * Get elapsed game time in milliseconds
     * @returns {number} Elapsed time
     */
    getElapsedTime() {
        return Date.now() - this.startTime;
    }

    /**
     * Get formatted elapsed time string
     * @returns {string} Formatted time (HH:MM:SS)
     */
    getFormattedTime() {
        const elapsed = this.getElapsedTime();
        const seconds = Math.floor(elapsed / 1000) % 60;
        const minutes = Math.floor(elapsed / 60000) % 60;
        const hours = Math.floor(elapsed / 3600000);

        const pad = (n) => n.toString().padStart(2, '0');
        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }

    /**
     * Get move count
     * @returns {number} Number of moves made
     */
    getMoveCount() {
        return this.moveCount;
    }

    /**
     * Save game state to localStorage
     * @param {number} slot - Save slot number (1-3)
     * @returns {Object} Result with success boolean and message
     */
    save(slot = 1) {
        try {
            const saveData = {
                version: 1,
                timestamp: Date.now(),
                currentRoomId: this.currentRoomId,
                inventory: this.inventory.getAllItems().map(item => item.id),
                flags: { ...this.flags },
                moveCount: this.moveCount,
                startTime: this.startTime,
                score: this.score
            };

            localStorage.setItem(
                `${this.savePrefix}${slot}`,
                JSON.stringify(saveData)
            );

            return {
                success: true,
                message: `Game saved to slot ${slot}.`
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to save game: ${error.message}`
            };
        }
    }

    /**
     * Load game state from localStorage
     * @param {number} slot - Save slot number (1-3)
     * @param {Function} getItemById - Function to get item by ID
     * @returns {Object} Result with success boolean and message
     */
    load(slot = 1, getItemById = null) {
        try {
            const saveKey = `${this.savePrefix}${slot}`;
            const saveJson = localStorage.getItem(saveKey);

            if (!saveJson) {
                return {
                    success: false,
                    message: `No saved game in slot ${slot}.`
                };
            }

            const saveData = JSON.parse(saveJson);

            // Restore state
            this.currentRoomId = saveData.currentRoomId;
            this.flags = { ...saveData.flags };
            this.moveCount = saveData.moveCount;
            this.startTime = saveData.startTime;
            this.score = saveData.score;

            // Restore inventory if we have a way to get items
            if (getItemById) {
                this.inventory.clear();
                for (const itemId of saveData.inventory) {
                    const item = getItemById(itemId);
                    if (item) {
                        this.inventory.add(item);
                    }
                }
            }

            return {
                success: true,
                message: `Game loaded from slot ${slot}.`
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to load game: ${error.message}`
            };
        }
    }

    /**
     * Check if a save exists in a slot
     * @param {number} slot - Save slot number
     * @returns {boolean} Whether save exists
     */
    hasSave(slot = 1) {
        return !!localStorage.getItem(`${this.savePrefix}${slot}`);
    }

    /**
     * Get info about a saved game
     * @param {number} slot - Save slot number
     * @returns {Object|null} Save info or null if no save
     */
    getSaveInfo(slot = 1) {
        try {
            const saveJson = localStorage.getItem(`${this.savePrefix}${slot}`);
            if (!saveJson) return null;

            const saveData = JSON.parse(saveJson);
            return {
                slot,
                timestamp: saveData.timestamp,
                date: new Date(saveData.timestamp).toLocaleString(),
                roomId: saveData.currentRoomId,
                score: saveData.score,
                moves: saveData.moveCount
            };
        } catch {
            return null;
        }
    }

    /**
     * Delete a saved game
     * @param {number} slot - Save slot number
     */
    deleteSave(slot = 1) {
        localStorage.removeItem(`${this.savePrefix}${slot}`);
    }

    /**
     * Reset the game state
     * @param {string} startingRoom - Room to start in
     */
    reset(startingRoom = 'cargo-bay-7') {
        this.currentRoomId = startingRoom;
        this.inventory.clear();
        this.flags = {};
        this.moveCount = 0;
        this.startTime = Date.now();
        this.score = 0;
    }
}
