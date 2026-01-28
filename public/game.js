/**
 * Cosmic Custodian - Main Entry Point
 * A text adventure game in the style of classic Sierra and LucasArts games
 */

import { Game } from '../src/engine/Game.js';
import { GameUI } from '../src/ui/GameUI.js';
import { rooms } from '../src/data/rooms.js';
import { items } from '../src/data/items.js';
import { characters } from '../src/data/characters.js';
import { initializePuzzles } from '../src/data/puzzles.js';

// Create the game instance
const game = new Game({
    outputCallback: (text, className) => ui.output(text, className),
    roomData: rooms,
    itemData: items,
    characterData: characters,
    startingRoom: 'cargo-bay-7'
});

// Initialize puzzle handlers
initializePuzzles(game);

// Create the UI
const ui = new GameUI({ game });

// Make game accessible for debugging
window.game = game;
window.ui = ui;

console.log('Cosmic Custodian loaded successfully!');
