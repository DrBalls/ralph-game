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
    setupKeycardDoorUnlock(game);
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

/**
 * Setup keycard door unlock mechanic
 * - Player can use keycards to unlock doors
 */
function setupKeycardDoorUnlock(game) {
    const keycard = game.items.get('keycard-cargo');
    if (!keycard) return;

    // Store original use handler if any
    const originalHandler = keycard._onUse;

    keycard.setUseHandler((item, target, gameState) => {
        const targetId = target?.id?.toLowerCase() || target?.toLowerCase?.() || '';

        // Check if using keycard with door or engineering
        if (targetId === 'door' || targetId === 'engineering door' ||
            targetId === 'engineering' || targetId === 'west' ||
            targetId === 'west door') {

            // Check if we're in the main corridor
            const currentRoomId = gameState.getCurrentRoomId();
            if (currentRoomId !== 'main-corridor') {
                return {
                    success: false,
                    message: "There's no door here that needs this keycard."
                };
            }

            // Check if already unlocked
            if (gameState.getFlag('engineering_door_unlocked')) {
                return {
                    success: false,
                    message: "The Engineering door is already unlocked."
                };
            }

            // Unlock the door!
            const mainCorridor = game.rooms.get('main-corridor');
            if (mainCorridor && mainCorridor.connections.west) {
                mainCorridor.connections.west.locked = false;
                gameState.setFlag('engineering_door_unlocked', true);
                gameState.addScore(5, 'engineering_door');

                return {
                    success: true,
                    message: `You wave the Cargo Keycard at the reader with the confidence of someone who has unlocked many doors in their career. Most of them were janitor closets, but still.

*BEEP*

The light turns green, and the blast door slides open with a satisfying hiss. The warm air of Engineering wafts out, carrying the smell of ozone and minor mechanical disasters.

"Access granted," the door announces unnecessarily. Yes, thank you, door. You noticed.

The way to Engineering is now open.`
                };
            }
        }

        // Fall through to original handler or default
        if (originalHandler) {
            return originalHandler(item, target, gameState);
        }

        return {
            success: false,
            message: "You're not sure how to use the keycard with that."
        };
    });
}

export default initializePuzzles;
