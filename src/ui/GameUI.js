/**
 * GameUI class - Handles the browser UI for the game
 */
export class GameUI {
    /**
     * Create a new GameUI
     * @param {Object} config - UI configuration
     * @param {Game} config.game - The game instance
     */
    constructor(config = {}) {
        this.game = config.game || null;

        // Get DOM elements
        this.gameOutput = document.getElementById('game-output');
        this.commandInput = document.getElementById('command-input');
        this.introScreen = document.getElementById('intro-screen');
        this.startButton = document.getElementById('start-button');
        this.locationName = document.getElementById('location-name');
        this.inventoryList = document.getElementById('inventory-list');
        this.scoreDisplay = document.getElementById('score');

        // Command history for up/down arrow navigation
        this.commandHistory = [];
        this.historyIndex = -1;

        // Bind event handlers
        this.bindEvents();
    }

    /**
     * Set the game instance
     * @param {Game} game - The game instance
     */
    setGame(game) {
        this.game = game;
    }

    /**
     * Bind UI event handlers
     */
    bindEvents() {
        // Start button click
        if (this.startButton) {
            this.startButton.addEventListener('click', () => this.startGame());
        }

        // Command input handling
        if (this.commandInput) {
            this.commandInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
        }

        // Allow pressing Enter on intro screen to start
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && this.introScreen && !this.introScreen.classList.contains('hidden')) {
                this.startGame();
            }
        });
    }

    /**
     * Handle keydown events on command input
     * @param {KeyboardEvent} e - The keyboard event
     */
    handleKeyDown(e) {
        if (e.key === 'Enter') {
            const input = this.commandInput.value.trim();
            if (input) {
                // Add to history
                this.commandHistory.push(input);
                this.historyIndex = this.commandHistory.length;

                // Clear input
                this.commandInput.value = '';

                // Echo the command
                this.output(`> ${input}`, 'system');

                // Process command
                if (this.game) {
                    this.game.handleCommand(input);
                    this.updateUI();
                }
            }
        } else if (e.key === 'ArrowUp') {
            // Navigate command history up
            e.preventDefault();
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.commandInput.value = this.commandHistory[this.historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            // Navigate command history down
            e.preventDefault();
            if (this.historyIndex < this.commandHistory.length - 1) {
                this.historyIndex++;
                this.commandInput.value = this.commandHistory[this.historyIndex];
            } else {
                this.historyIndex = this.commandHistory.length;
                this.commandInput.value = '';
            }
        }
    }

    /**
     * Start the game
     */
    startGame() {
        // Hide intro screen
        if (this.introScreen) {
            this.introScreen.classList.add('hidden');
        }

        // Focus command input
        if (this.commandInput) {
            this.commandInput.focus();
        }

        // Start the game
        if (this.game) {
            this.game.start();
            this.updateUI();
        }
    }

    /**
     * Output text to the game display
     * @param {string} text - The text to display
     * @param {string} className - Optional CSS class for styling
     */
    output(text, className = '') {
        if (!this.gameOutput) return;

        const p = document.createElement('p');
        p.textContent = text;
        if (className) {
            p.className = className;
        }
        this.gameOutput.appendChild(p);

        // Auto-scroll to bottom
        this.gameOutput.scrollTop = this.gameOutput.scrollHeight;
    }

    /**
     * Clear the game output
     */
    clearOutput() {
        if (!this.gameOutput) return;

        while (this.gameOutput.firstChild) {
            this.gameOutput.removeChild(this.gameOutput.firstChild);
        }
    }

    /**
     * Update UI elements (location, inventory, score, room image)
     */
    updateUI() {
        if (!this.game) return;

        // Update location name and room image
        const room = this.game.getCurrentRoom();
        if (this.locationName) {
            this.locationName.textContent = room ? room.name : 'Unknown';
        }

        // Update room image
        if (room && room.image) {
            this.updateImage(`images/${room.image}`);
        }

        // Update inventory display
        if (this.inventoryList) {
            const items = this.game.state.inventory.list();
            this.inventoryList.textContent = items.length > 0 ? items.join(', ') : 'Empty';
        }

        // Update score
        if (this.scoreDisplay) {
            this.scoreDisplay.textContent = this.game.state.getScore();
        }
    }

    /**
     * Update room image
     * @param {string} imageUrl - URL of the room image
     */
    updateImage(imageUrl) {
        const canvas = document.getElementById('game-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };

        img.onerror = () => {
            // Draw placeholder if image not found
            ctx.fillStyle = '#1a1a2e';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#4a4a6e';
            ctx.font = '20px VT323';
            ctx.textAlign = 'center';
            ctx.fillText('[ Image Loading... ]', canvas.width / 2, canvas.height / 2);
        };

        img.src = imageUrl;
    }

    /**
     * Show a modal dialog
     * @param {string} title - Dialog title
     * @param {string} message - Dialog message
     * @param {Function} onClose - Callback when closed
     */
    showDialog(title, message, onClose = null) {
        // For now, just output to game display
        this.output(`--- ${title} ---`, 'room-title');
        this.output(message, 'description');
        if (onClose) onClose();
    }
}
