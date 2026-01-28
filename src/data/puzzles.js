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
    setupSmellingSaltsPuzzle(game);
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

/**
 * Setup the smelling salts puzzle
 * - Player combines ammonia with rubber gloves to create smelling salts
 * - Using smelling salts on Dr. Patchwell wakes her up
 */
function setupSmellingSaltsPuzzle(game) {
    const ammonia = game.items.get('ammonia');
    const gloves = game.items.get('rubber-gloves');
    const smellingSalts = game.items.get('smelling-salts');

    if (!ammonia || !gloves) return;

    // Setup ammonia use handler to create smelling salts
    ammonia.setUseHandler((item, target, gameState) => {
        const targetId = target?.id?.toLowerCase() || target?.toLowerCase?.() || '';

        // Check if using ammonia with rubber gloves
        if (targetId === 'rubber-gloves' || targetId === 'gloves' ||
            targetId === 'rubber gloves' || targetId === 'medical gloves') {

            // Check if we have the gloves in inventory
            if (!gameState.inventory.has('rubber-gloves')) {
                return {
                    success: false,
                    message: "You'd need to have the rubber gloves first."
                };
            }

            // Check if puzzle already solved
            if (gameState.getFlag('smelling_salts_created')) {
                return {
                    success: false,
                    message: "You've already made the smelling salts. One pair of ammonia-soaked gloves is quite enough."
                };
            }

            // Create the smelling salts!
            gameState.setFlag('smelling_salts_created', true);

            // Remove ammonia and gloves from inventory
            gameState.inventory.remove('ammonia');
            gameState.inventory.remove('rubber-gloves');

            // Add smelling salts to inventory
            if (smellingSalts) {
                smellingSalts.hidden = false;
                gameState.inventory.add(smellingSalts);
            }

            gameState.addScore(10, 'smelling_salts');

            return {
                success: true,
                message: `Your years of janitorial chemistry training kick in. You carefully pour the ammonia solution onto the rubber gloves, creating a makeshift smelling salts.

"They said I was crazy to get my Advanced Cleaning Chemistry Certification," you mutter. "Who's crazy now?"

The gloves are now thoroughly soaked and absolutely reeking of ammonia. Your eyes water, but you feel a surge of professional pride.

You now have Makeshift Smelling Salts!`
            };
        }

        // Using ammonia on the doctor directly
        if (targetId === 'dr-patchwell' || targetId === 'doctor' ||
            targetId === 'patchwell' || targetId === 'vera') {
            return {
                success: false,
                message: "You could splash ammonia on the doctor, but that seems cruel and possibly illegal. Maybe if you combined it with something to make proper smelling salts..."
            };
        }

        return {
            success: false,
            message: "You're not sure what to do with ammonia and that. Your chemistry training doesn't cover this combination."
        };
    });

    // Setup smelling salts use handler
    if (smellingSalts) {
        smellingSalts.setUseHandler((item, target, gameState) => {
            const targetId = target?.id?.toLowerCase() || target?.toLowerCase?.() || '';

            // Check if using on the doctor
            if (targetId === 'dr-patchwell' || targetId === 'doctor' ||
                targetId === 'patchwell' || targetId === 'vera') {

                // Check if we're in the medical bay
                const currentRoomId = gameState.getCurrentRoomId();
                if (currentRoomId !== 'medical-bay') {
                    return {
                        success: false,
                        message: "Dr. Patchwell isn't here. She's in the Medical Bay."
                    };
                }

                // Check if doctor already awake
                if (gameState.getFlag('doctor_awake')) {
                    return {
                        success: false,
                        message: "Dr. Patchwell is already awake. Please don't assault the conscious medical officer with ammonia."
                    };
                }

                // Wake the doctor!
                gameState.setFlag('doctor_awake', true);

                // Update doctor's state
                const drPatchwell = game.characters.get('dr-patchwell');
                if (drPatchwell) {
                    drPatchwell.setState('awake');
                }

                // Remove smelling salts (used up)
                gameState.inventory.remove('smelling-salts');

                gameState.addScore(15, 'wake_doctor');

                return {
                    success: true,
                    message: `You wave the ammonia-soaked gloves under Dr. Patchwell's nose with the care and precision of someone who has revived many unconscious people. Mostly janitors who passed out in cleaning supply closets, but still.

*SNNNNNFFFFFF*

Dr. Patchwell's eyes fly open. She bolts upright, nearly headbutting you.

"GAH! What—who—why do I smell a chemical factory?!" She blinks rapidly, focusing on you. "Wait... Zyx-7? The janitor? Why are YOU waking me up with—are those my RUBBER GLOVES?!"

She looks around, taking in the emergency lighting and the general state of chaos.

"Oh no. The artifact. The gala. How long was I—is everyone else—?" She rubs her temples. "Never mind. You can fill me in. I think I need coffee first. LOTS of coffee."

Dr. Patchwell is now awake!`
                };
            }

            return {
                success: false,
                message: "You're not sure who or what to use the smelling salts on. Best save them for someone who needs waking up."
            };
        });
    }
}

export default initializePuzzles;
