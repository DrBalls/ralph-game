/**
 * Cosmic Custodian - Main Entry Point
 * A text adventure game in the style of classic Sierra and LucasArts games
 */

import { Game } from '../src/engine/Game.js';
import { GameUI } from '../src/ui/GameUI.js';

// Temporary room data until we implement US-009
const roomData = {
    'cargo-bay-7': {
        name: 'CARGO BAY 7',
        description: 'You are in the cramped confines of Cargo Bay 7, surrounded by crates of cleaning supplies and spare parts. The emergency lighting casts everything in a dim red glow. A toilet sits in the corner - your unlikely savior from the energy wave that knocked out the rest of the crew.',
        connections: {
            east: 'cargo-corridor'
        },
        features: {
            'toilet': 'The toilet that saved your life. It\'s seen better days, but you owe it everything.',
            'crates': 'Cleaning supplies and spare parts. The essentials.',
            'shelf': 'A high metal shelf. Something glints up there - looks like a keycard.',
            'lighting': 'The emergency lighting flickers ominously, casting red shadows.'
        }
    },
    'cargo-corridor': {
        name: 'CARGO BAY CORRIDOR',
        description: 'A narrow corridor connects Cargo Bay 7 to the rest of the station. Emergency lights flicker overhead, and you can hear the distant hum of failing systems. Cables hang from the ceiling where panels have been knocked loose.',
        connections: {
            west: 'cargo-bay-7',
            north: 'main-corridor'
        },
        features: {
            'cables': 'Sparking cables dangle dangerously. Best not to touch them.',
            'panels': 'Wall panels knocked loose by the energy wave.'
        }
    },
    'main-corridor': {
        name: 'MAIN CORRIDOR',
        description: 'The main corridor of the Pristine Venture stretches before you. Doors lead off in multiple directions, and emergency signs flicker overhead. The usual pristine white walls are now marked with scorch marks and that strange alien goo.',
        connections: {
            south: 'cargo-corridor'
        },
        features: {
            'goo': 'Pulsing, iridescent alien goo. It smells faintly of burnt toast.',
            'signs': 'Emergency signs point to various locations: Bridge (North), Medical (East), Engineering (West).'
        }
    }
};

// Temporary item data until we implement full items
const itemData = {
    'mop': {
        name: 'Mop',
        description: 'A well-worn mop.',
        examineText: 'Your trusty mop. You\'ve been together for 15 years. It\'s seen things. Cleaned things. It\'s more than a cleaning implement - it\'s a friend.',
        takeable: true,
        startingRoom: 'cargo-bay-7',
        aliases: ['trusty mop', 'old mop']
    },
    'bucket': {
        name: 'Bucket',
        description: 'A dented metal bucket.',
        examineText: 'A standard-issue janitorial bucket. Dented from years of service. There\'s still some murky water in the bottom.',
        takeable: true,
        startingRoom: 'cargo-bay-7',
        aliases: ['metal bucket']
    },
    'keycard-cargo': {
        name: 'Cargo Keycard',
        description: 'A keycard glints on the high shelf.',
        examineText: 'A standard station keycard, marked "CARGO". It could open locked doors in this section.',
        takeable: false,
        cantTakeMessage: 'The shelf is too high to reach. Maybe you could use something to knock it down?',
        startingRoom: 'cargo-bay-7',
        aliases: ['keycard', 'card', 'cargo keycard']
    }
};

// Create the game instance
const game = new Game({
    outputCallback: (text, className) => ui.output(text, className),
    roomData: roomData,
    itemData: itemData,
    startingRoom: 'cargo-bay-7'
});

// Create the UI
const ui = new GameUI({ game });

// Make game accessible for debugging
window.game = game;
window.ui = ui;

console.log('Cosmic Custodian loaded successfully!');
