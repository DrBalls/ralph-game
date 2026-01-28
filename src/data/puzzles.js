/**
 * Puzzle configuration and handlers for Cosmic Custodian
 *
 * This module sets up puzzle-specific item interactions and game state changes.
 */

/**
 * Initialize all puzzle handlers on a Game instance
 * @param {Game} game - The game instance to configure
 */
export function initializePuzzles(game) {
    setupKeycardPuzzle(game);
    // Additional puzzles will be added here
}

/**
 * Setup the Cargo Bay keycard puzzle
 * - Player must use mop to knock keycard off high shelf
 */
function setupKeycardPuzzle(game) {
    const mop = game.items.get('mop');
    const keycard = game.items.get('keycard-cargo');

    if (!mop || !keycard) return;

    // Setup mop's use handler for the shelf/keycard puzzle
    mop.setUseHandler((item, target, gameState) => {
        // Check if using mop with shelf or keycard
        const targetId = target?.id || target?.toLowerCase?.() || '';

        if (targetId === 'shelf' || targetId === 'keycard-cargo' || targetId === 'keycard') {
            // Check if puzzle already solved
            if (gameState.getFlag('keycard_knocked_down')) {
                return {
                    success: false,
                    message: "You've already knocked down the keycard. No need to keep poking at the shelf."
                };
            }

            // Solve the puzzle!
            gameState.setFlag('keycard_knocked_down', true);

            // Make keycard takeable
            keycard.takeable = true;
            keycard.description = 'The Cargo Keycard lies on the floor where it fell.';
            keycard.cantTakeMessage = null;

            // Add score
            gameState.addScore(10, 'keycard_puzzle');

            return {
                success: true,
                message: `You extend your trusty mop toward the high shelf with the practiced ease of someone who has knocked things off high shelves professionally for 15 years.

*THWACK*

The keycard clatters to the floor with a satisfying sound. The shelf looks slightly offended.

"Nothing personal," you mutter to the shelf. It's important to maintain professional relationships with furniture.

The Cargo Keycard is now on the floor within easy reach.`
            };
        }

        // Default mop use (cleaning)
        if (target) {
            return {
                success: false,
                message: `You contemplate mopping the ${target.name || target}, but decide against it. There are bigger messes to deal with right now.`
            };
        }

        return {
            success: false,
            message: "You wave your mop around experimentally. It feels good, but accomplishes nothing. Story of your life, really."
        };
    });

    // Setup custom examine handler for keycard based on state
    keycard.setExamineHandler((item, gameState) => {
        if (gameState?.getFlag('keycard_knocked_down')) {
            return `The Cargo Keycard lies on the floor, no longer mocking you from its high perch. It's marked "CARGO" in faded letters. Victory tastes sweet - or maybe that's just the cleaning solvent fumes.`;
        }
        return null; // Use default examineText
    });
}

export default initializePuzzles;
