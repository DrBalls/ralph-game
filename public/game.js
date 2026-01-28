/**
 * Cosmic Custodian - Main Entry Point
 * A text adventure game in the style of classic Sierra and LucasArts games
 */

// DOM Elements
const gameOutput = document.getElementById('game-output');
const commandInput = document.getElementById('command-input');
const introScreen = document.getElementById('intro-screen');
const startButton = document.getElementById('start-button');
const locationName = document.getElementById('location-name');
const inventoryList = document.getElementById('inventory-list');
const scoreDisplay = document.getElementById('score');

/**
 * Output text to the game display
 * @param {string} text - The text to display
 * @param {string} className - Optional CSS class for styling
 */
function output(text, className = '') {
    const p = document.createElement('p');
    p.textContent = text;
    if (className) {
        p.className = className;
    }
    gameOutput.appendChild(p);
    gameOutput.scrollTop = gameOutput.scrollHeight;
}

/**
 * Clear the game output safely
 */
function clearOutput() {
    while (gameOutput.firstChild) {
        gameOutput.removeChild(gameOutput.firstChild);
    }
}

/**
 * Handle player commands
 * @param {string} input - The raw command string
 */
function handleCommand(input) {
    const command = input.trim().toUpperCase();

    if (!command) return;

    // Echo the command
    output(`> ${input}`, 'system');

    // Placeholder - will be replaced by Parser class in US-005
    if (command === 'LOOK' || command === 'L') {
        output('CARGO BAY 7', 'room-title');
        output('You are in the cramped confines of Cargo Bay 7, surrounded by crates of cleaning supplies and spare parts. The emergency lighting casts everything in a dim red glow. A toilet sits in the corner - your unlikely savior from the energy wave that knocked out the rest of the crew.', 'description');
        output('A mop leans against the wall. A bucket sits nearby. High above, you can see a keycard on a shelf.', 'items');
        output('Exits: EAST', 'exits');
    } else if (command === 'INVENTORY' || command === 'I') {
        output('You are carrying: nothing yet.', 'description');
    } else if (command === 'HELP') {
        output('Available commands:', 'room-title');
        output('LOOK - Examine your surroundings');
        output('EXAMINE [object] - Look at something closely');
        output('TAKE [object] - Pick up an item');
        output('USE [object] - Use an item');
        output('USE [object] WITH [object] - Combine or use items together');
        output('INVENTORY (or I) - Check what you\'re carrying');
        output('GO [direction] - Move in a direction (N/S/E/W/UP/DOWN)');
        output('TALK TO [character] - Speak with someone');
        output('HELP - Show this message');
    } else {
        output('I don\'t understand that command. Type HELP for a list of commands.', 'error');
    }
}

/**
 * Start the game
 */
function startGame() {
    introScreen.classList.add('hidden');
    commandInput.focus();

    // Display initial room
    output('═══════════════════════════════════════════', 'system');
    output('Welcome to COSMIC CUSTODIAN: The Janitorial Frontier', 'room-title');
    output('═══════════════════════════════════════════', 'system');
    output('');
    handleCommand('look');
}

// Event Listeners
startButton.addEventListener('click', startGame);

commandInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const input = commandInput.value;
        commandInput.value = '';
        handleCommand(input);
    }
});

// Allow pressing Enter on intro screen to start
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !introScreen.classList.contains('hidden')) {
        startGame();
    }
});

// Initialize location display
locationName.textContent = 'CARGO BAY 7';

console.log('Cosmic Custodian loaded successfully!');
