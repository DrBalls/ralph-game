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
    setupCoffeePuzzle(game);
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
 * Setup the coffee puzzle
 * - Player repairs synthesizer with duct tape
 * - Player uses mug with synthesizer to create coffee
 * - Player gives coffee to doctor to get engineering keycard
 */
function setupCoffeePuzzle(game) {
    const ductTape = game.items.get('duct-tape');
    const coffeeMug = game.items.get('coffee-mug');
    const coffee = game.items.get('caffeinated-sludge');
    const engKeycard = game.items.get('engineering-keycard');

    // Setup duct tape use handler to repair synthesizer
    if (ductTape) {
        ductTape.setUseHandler((item, target, gameState) => {
            const targetId = target?.id?.toLowerCase() || target?.toLowerCase?.() || '';

            if (targetId === 'synthesizer' || targetId === 'food synthesizer') {
                // Check if we're in the mess hall
                const currentRoomId = gameState.getCurrentRoomId();
                if (currentRoomId !== 'mess-hall') {
                    return {
                        success: false,
                        message: "There's no synthesizer here to repair."
                    };
                }

                // Check if already repaired
                if (gameState.getFlag('synthesizer_repaired')) {
                    return {
                        success: false,
                        message: "The synthesizer is already repaired. Your duct tape handiwork holds strong."
                    };
                }

                // Repair the synthesizer!
                gameState.setFlag('synthesizer_repaired', true);
                gameState.inventory.remove('duct-tape');
                gameState.addScore(5, 'repair_synthesizer');

                return {
                    success: true,
                    message: `You approach the sparking food synthesizer with the confidence of someone who has fixed many things with duct tape. Which is to say, you.

*RRRRIP* *STICK* *SMOOTH*

You apply the duct tape to the synthesizer's exposed wiring with surgical precision. The sparking stops. The grinding noise becomes a gentle hum. The display settles on "READY TO SERVE."

"Fixed it," you announce to no one in particular. It feels important to announce these things.

The food synthesizer is now operational. Time for coffee.`
                };
            }

            return {
                success: false,
                message: "You're not sure what to repair with the duct tape here."
            };
        });
    }

    // Setup coffee mug use handler to make coffee
    if (coffeeMug) {
        coffeeMug.setUseHandler((item, target, gameState) => {
            const targetId = target?.id?.toLowerCase() || target?.toLowerCase?.() || '';

            if (targetId === 'synthesizer' || targetId === 'food synthesizer' ||
                targetId === 'coffee station') {
                // Check if we're in the mess hall
                const currentRoomId = gameState.getCurrentRoomId();
                if (currentRoomId !== 'mess-hall') {
                    return {
                        success: false,
                        message: "There's no synthesizer here."
                    };
                }

                // Check if synthesizer is repaired
                if (!gameState.getFlag('synthesizer_repaired')) {
                    return {
                        success: false,
                        message: "The synthesizer sparks angrily when you approach. It needs to be repaired first - maybe some duct tape would help."
                    };
                }

                // Check if already made coffee
                if (gameState.getFlag('coffee_created')) {
                    return {
                        success: false,
                        message: "You've already made coffee. One cup of this stuff is enough to keep anyone awake for a week."
                    };
                }

                // Make the coffee!
                gameState.setFlag('coffee_created', true);
                gameState.inventory.remove('coffee-mug');

                if (coffee) {
                    coffee.hidden = false;
                    gameState.inventory.add(coffee);
                }

                gameState.addScore(5, 'make_coffee');

                return {
                    success: true,
                    message: `You place the mug under the synthesizer's dispenser and press the button marked "COFFEE - EXTRA STRENGTH."

*WHIRRRRR* *GURGLE* *SPLORP*

A stream of liquid that can only charitably be called "coffee" fills the mug. It's the color of a black hole and smells like it could dissolve metal. The mug is now uncomfortably warm.

"Perfect," you say, knowing that Dr. Patchwell's standards for coffee are... flexible.

You now have a mug of Caffeinated Sludge!`
                };
            }

            return {
                success: false,
                message: "You're not sure what to do with the mug here."
            };
        });
    }

    // Setup coffee use handler to give to doctor
    if (coffee) {
        coffee.setUseHandler((item, target, gameState) => {
            const targetId = target?.id?.toLowerCase() || target?.toLowerCase?.() || '';

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

                // Check if doctor is awake
                if (!gameState.getFlag('doctor_awake')) {
                    return {
                        success: false,
                        message: "Dr. Patchwell is unconscious. She can't drink coffee while she's asleep... though knowing her, she'd probably try."
                    };
                }

                // Check if already given coffee
                if (gameState.getFlag('coffee_given')) {
                    return {
                        success: false,
                        message: "You've already given Dr. Patchwell coffee. She's caffeinated and grateful."
                    };
                }

                // Give the coffee!
                gameState.setFlag('coffee_given', true);
                gameState.inventory.remove('caffeinated-sludge');

                // Give player the engineering keycard
                if (engKeycard) {
                    engKeycard.hidden = false;
                    gameState.inventory.add(engKeycard);
                }

                // Update doctor's state
                const drPatchwell = game.characters.get('dr-patchwell');
                if (drPatchwell) {
                    drPatchwell.setState('helped');
                }

                gameState.addScore(15, 'help_doctor');

                return {
                    success: true,
                    message: `You offer the mug of caffeinated sludge to Dr. Patchwell. Her eyes light up with an intensity usually reserved for religious experiences.

"Is that... COFFEE?!" She snatches the mug from your hands with surprising speed for someone who was unconscious twenty minutes ago.

She takes a long sip, pauses, and her expression shifts from desperate to contemplative to satisfied.

"That is... the worst coffee I've ever had," she says, taking another sip. "I love it. Thank you."

She reaches into her coat pocket and produces a keycard. "Here - take this. Engineering keycard. Chief Krix gave it to me for emergencies, and I'd say this qualifies. You'll need it to access the Science Lab."

She takes another sip of coffee. "Now go save the station. I'll... stay here. Drink this. Try not to think about how we're all going to die."

You received the Engineering Keycard!`
                };
            }

            return {
                success: false,
                message: "You're not sure who to give this coffee to."
            };
        });
    }
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
