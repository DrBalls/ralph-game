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
    setupScienceLabPuzzle(game);
    setupPowerCellPuzzle(game);
    setupMaintenanceTunnelsPuzzle(game);
    setupPoetryBookPuzzle(game);
    setupDiscoBallPuzzle(game);
    setupOverrideCodePuzzle(game);
}

/**
 * Setup the Cargo Bay keycard puzzle
 * - Player must use mop to knock keycard off high shelf
 */
function setupKeycardPuzzle(game) {
    const mop = game.items.get('mop');
    const keycard = game.items.get('keycard-cargo');

    if (!mop || !keycard) return;

    // Setup mop's use handler for the shelf/keycard puzzle AND disco ball puzzle
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

        // Check if using mop with disco ball
        if (targetId === 'disco-ball' || targetId === 'disco ball' || targetId === 'ball' || targetId === 'mirror ball') {
            // Check if we're in the ballroom
            const currentRoomId = gameState.getCurrentRoomId();
            if (currentRoomId !== 'ballroom') {
                return {
                    success: false,
                    message: "There's no disco ball here to knock down."
                };
            }

            // Check if puzzle already solved
            if (gameState.getFlag('disco_ball_knocked_down')) {
                return {
                    success: false,
                    message: "The disco ball is already on the floor in a million glittery pieces. You've retrieved what was inside."
                };
            }

            // Knock down the disco ball!
            gameState.setFlag('disco_ball_knocked_down', true);

            // Get the personality chip and disco ball items
            const discoBall = game.items.get('disco-ball');
            const personalityChip = game.items.get('personality-chip');

            // Update disco ball state
            if (discoBall) {
                discoBall.takeable = false;
                discoBall.description = 'The shattered remains of the disco ball lie scattered across the floor.';
            }

            // Add personality chip to inventory
            if (personalityChip) {
                personalityChip.hidden = false;
                gameState.inventory.add(personalityChip);
            }

            gameState.addScore(15, 'disco_ball_puzzle');

            return {
                success: true,
                message: `You eye the disco ball hanging twelve feet above you. You've knocked many things off high places in your career. This is just another day at the office.

You extend your mop toward the disco ball with the confidence of someone who has done this thousands of times. The mop handle creaks ominously - it's not as young as it used to be.

*THWACK*

The disco ball wobbles.

*THWACK THWACK*

The chain snaps!

*CRASH* *TINKLE* *SCATTER*

The disco ball plummets to the floor and shatters into a thousand glittering pieces. Mirrored shards scatter everywhere - this is going to take FOREVER to clean up.

But there, among the debris, you spot it: a small memory chip, miraculously undamaged. The label reads "DUSTY PERSONALITY BACKUP v2.3."

"Why was this in the disco ball?" you mutter to yourself. But you already know the answer: because Engineering.

You pocket the chip. Your mop creaks reproachfully - you've definitely shortened its lifespan with that move.

You found DUSTY's Personality Chip!`
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
 * Setup the power cell puzzle
 * - Player uses power cell with the reactor/slot in Engineering Deck
 */
function setupPowerCellPuzzle(game) {
    const powerCell = game.items.get('power-cell');

    if (!powerCell) return;

    powerCell.setUseHandler((item, target, gameState) => {
        const targetId = target?.id?.toLowerCase() || target?.toLowerCase?.() || '';

        // Check if using power cell with reactor, slot, or generator
        if (targetId === 'reactor' || targetId === 'slot' || targetId === 'power cell slot' ||
            targetId === 'generator' || targetId === 'emergency generator') {
            // Check if we're in the engineering deck
            const currentRoomId = gameState.getCurrentRoomId();
            if (currentRoomId !== 'engineering-deck') {
                return {
                    success: false,
                    message: "There's nothing here that needs a power cell."
                };
            }

            // Check if already restored power
            if (gameState.getFlag('power_restored')) {
                return {
                    success: false,
                    message: "You've already restored emergency power. The station hums with renewed energy."
                };
            }

            // Restore power!
            gameState.setFlag('power_restored', true);

            // Remove power cell from inventory (installed)
            gameState.inventory.remove('power-cell');

            gameState.addScore(20, 'restore_power');

            return {
                success: true,
                message: `You approach the emergency power cell slot with the confidence of someone who has inserted many things into many slots. Professionally speaking.

You line up the power cell with the slot, take a deep breath, and...

*CLICK*

*WHIRRRRRR*

*BZZZZZT*

The power cell locks into place. For a terrifying moment, nothing happens. Then the emergency generator roars to life, and throughout the station, lights begin to stabilize.

The constant flickering stops. The ominous red emergency lighting shifts to a more reassuring (if still dim) yellow. Somewhere in the distance, you hear systems coming back online.

"EMERGENCY POWER RESTORED," announces a voice over the intercom. "STATION SYSTEMS AT 47% CAPACITY. THAT'S... ACTUALLY BETTER THAN USUAL."

You feel a surge of pride. Not bad for a janitor.

Emergency power has been restored! The station's systems are more stable now.`
            };
        }

        return {
            success: false,
            message: "You're not sure where to install the power cell here."
        };
    });
}

/**
 * Setup the Science Lab goo puzzle
 * - Player uses Universal Cleaning Solvent on the alien goo blocking the lab
 */
function setupScienceLabPuzzle(game) {
    const solvent = game.items.get('solvent');

    if (!solvent) return;

    solvent.setUseHandler((item, target, gameState) => {
        const targetId = target?.id?.toLowerCase() || target?.toLowerCase?.() || '';

        // Check if using solvent on goo or door
        if (targetId === 'goo' || targetId === 'alien goo' || targetId === 'door' ||
            targetId === 'alien-goo' || targetId === 'doorway') {
            // Check if we're in the science lab corridor
            const currentRoomId = gameState.getCurrentRoomId();
            if (currentRoomId !== 'science-lab-corridor') {
                return {
                    success: false,
                    message: "There's no alien goo blocking anything here. Save the solvent for when you need it."
                };
            }

            // Check if already cleared
            if (gameState.getFlag('science_lab_goo_cleared')) {
                return {
                    success: false,
                    message: "You've already dissolved the goo. The way to the Science Lab is clear."
                };
            }

            // Clear the goo!
            gameState.setFlag('science_lab_goo_cleared', true);

            // Unlock the door
            const corridor = game.rooms.get('science-lab-corridor');
            if (corridor && corridor.connections.east) {
                corridor.connections.east.locked = false;
            }

            // Remove solvent from inventory (used up)
            gameState.inventory.remove('solvent');

            gameState.addScore(10, 'clear_goo');

            return {
                success: true,
                message: `You approach the wall of alien goo with the confidence of someone who has dissolved many things that shouldn't exist. Which is to say, you.

"Universal Cleaning Solvent," you announce, holding up the bottle. "For all your dissolution needs."

You pour the solvent onto the goo. For a moment, nothing happens. Then:

*HISSSSSSS* *BUBBLE* *SPLORP*

The goo reacts violently, frothing and bubbling as it dissolves. It makes sounds that might be screaming, if goo could scream. You choose to believe it can't.

Within seconds, the doorway is clear. The goo has completely dissolved, leaving only a faint burnt-toast smell and your profound sense of professional satisfaction.

"Just another day at the office," you mutter.

The way to the Science Lab is now open!`
            };
        }

        return {
            success: false,
            message: "You're not sure what to dissolve with the solvent here. This stuff is strong - best to save it for something that really needs dissolving."
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

/**
 * Setup the maintenance tunnels puzzle
 * - Player uses emergency flare to navigate the dark tunnels
 */
function setupMaintenanceTunnelsPuzzle(game) {
    const flare = game.items.get('emergency-flare');

    if (!flare) return;

    flare.setUseHandler((item, target, gameState) => {
        const targetId = target?.id?.toLowerCase() || target?.toLowerCase?.() || '';

        // Check if using flare with panel, tunnels, or darkness
        if (targetId === 'panel' || targetId === 'maintenance panel' ||
            targetId === 'tunnels' || targetId === 'maintenance tunnels' ||
            targetId === 'darkness' || targetId === 'north') {
            // Check if we're in engineering deck
            const currentRoomId = gameState.getCurrentRoomId();
            if (currentRoomId !== 'engineering-deck') {
                return {
                    success: false,
                    message: "There's no dark tunnel entrance here that needs illuminating."
                };
            }

            // Check if already lit
            if (gameState.getFlag('tunnels_lit')) {
                return {
                    success: false,
                    message: "You've already lit the flare. The tunnels are navigable now - head north when ready."
                };
            }

            // Light the flare!
            gameState.setFlag('tunnels_lit', true);

            // Unlock the maintenance tunnels
            const engDeck = game.rooms.get('engineering-deck');
            if (engDeck && engDeck.connections.north) {
                engDeck.connections.north.locked = false;
            }

            gameState.addScore(5, 'light_tunnels');

            return {
                success: true,
                message: `You pull the tab on the emergency flare with practiced ease. After all, this isn't your first time navigating the maintenance tunnels - just the first time you've had a legitimate reason.

*FWOOOOSH*

The flare ignites with a satisfying hiss, casting a warm red glow that pushes back the darkness. The tunnels beyond the maintenance panel are now visible - cramped, dusty, and exactly as uninviting as you remember.

"Thirty minutes of light," you remind yourself. "Better make them count."

The flare illuminates the way. The maintenance panel is now a viable passage.

The way north to the Maintenance Tunnels is now open!`
            };
        }

        return {
            success: false,
            message: "You're not sure where to use the flare here. Save it for somewhere dark."
        };
    });
}

/**
 * Setup the poetry book puzzle
 * - Player reads the poetry book to find the override code
 */
function setupPoetryBookPuzzle(game) {
    const poetryBook = game.items.get('poetry-book');
    const overrideCode = game.items.get('override-code');

    if (!poetryBook) return;

    poetryBook.setUseHandler((item, target, gameState) => {
        // Reading the book (use book, or use book with self)
        const targetId = target?.id?.toLowerCase() || target?.toLowerCase?.() || '';

        if (!target || targetId === 'book' || targetId === 'poetry' || targetId === 'self' || targetId === 'me') {
            // Check if already found the code
            if (gameState.getFlag('override_code_found')) {
                return {
                    success: false,
                    message: `You've already extracted the override code from the Captain's terrible poetry. There's no need to subject yourself to more. Your soul can only take so much.`
                };
            }

            // Find the code!
            gameState.setFlag('override_code_found', true);

            // Add override code to inventory
            if (overrideCode) {
                overrideCode.hidden = false;
                gameState.inventory.add(overrideCode);
            }

            gameState.addScore(15, 'find_override_code');

            return {
                success: true,
                message: `You open "Stellar Sonnets: A Captain's Soul" and immediately regret your life choices.

The first poem is titled "Ode to My Magnificent Mustache." You skim it. The words "bristling" and "manly" appear seventeen times.

The second poem, "Why I Am the Best Captain," is somehow worse. The rhyme scheme is criminal.

You're about to give up when you notice something on the last page. Hidden among the closing "acknowledgments" (which are just the Captain thanking himself) is a handwritten note:

"In case I forget - OVERRIDE CODE: BLUSTER-ALPHA-7-MAGNIFICENT"

Underneath, he's written: "Note: Change this to something even more magnificent later."

You tear out the page. The poetry book's contribution to literature will not be missed.

You found the Captain's Override Code!`
            };
        }

        return {
            success: false,
            message: "You're not sure what to do with the poetry book and that."
        };
    });

    // Also allow READ BOOK command - add custom examine handler
    poetryBook.setExamineHandler((item, gameState) => {
        if (gameState?.getFlag('override_code_found')) {
            return `The book is now missing its last page, which contained the override code. The remaining content is pure, weapons-grade bad poetry. You feel slightly unclean just looking at it.`;
        }
        return null; // Use default examineText
    });
}

/**
 * Setup the disco ball puzzle
 * - Mostly handled in the mop's use handler in setupKeycardPuzzle
 * - This function just sets up the disco ball's examine handler
 */
function setupDiscoBallPuzzle(game) {
    const discoBall = game.items.get('disco-ball');

    if (!discoBall) return;

    // Setup custom examine handler for disco ball based on state
    discoBall.setExamineHandler((item, gameState) => {
        if (gameState?.getFlag('disco_ball_knocked_down')) {
            return `The shattered remains of the disco ball lie scattered across the floor in a glittering mess. Among the debris, the mounting bracket still swings gently from the ceiling, as if mourning its fallen friend.

You've already retrieved the personality chip that was hidden inside. The cleanup of these mirror shards is going to be a nightmare, but that's a problem for future you.`;
        }
        return null; // Use default examineText
    });
}

/**
 * Setup the override code puzzle
 * - Player uses the Captain's override code to unlock DUSTY's Core
 */
function setupOverrideCodePuzzle(game) {
    const overrideCode = game.items.get('override-code');

    if (!overrideCode) return;

    overrideCode.setUseHandler((item, target, gameState) => {
        const targetId = target?.id?.toLowerCase() || target?.toLowerCase?.() || '';

        // Check if using code with door, panel, or core
        if (targetId === 'door' || targetId === 'core door' || targetId === 'panel' ||
            targetId === 'dusty core' || targetId === 'dusty-core' || targetId === 'west') {
            // Check if we're on the bridge
            const currentRoomId = gameState.getCurrentRoomId();
            if (currentRoomId !== 'bridge') {
                return {
                    success: false,
                    message: "There's nothing here that needs the override code."
                };
            }

            // Check if already unlocked
            if (gameState.getFlag('dusty_core_unlocked')) {
                return {
                    success: false,
                    message: "DUSTY's Core is already unlocked. The door is open."
                };
            }

            // Unlock the door!
            gameState.setFlag('dusty_core_unlocked', true);

            // Unlock the actual door connection
            const bridge = game.rooms.get('bridge');
            if (bridge && bridge.connections.west) {
                bridge.connections.west.locked = false;
            }

            gameState.addScore(10, 'unlock_dusty_core');

            return {
                success: true,
                message: `You approach the door to DUSTY's Core and find a keypad glowing expectantly. You read from the scrap of paper:

"BLUSTER-ALPHA-7-MAGNIFICENT"

You type it in, wincing slightly at the egotism of it all.

*BEEP* *BEEP* *BEEP*

"OVERRIDE ACCEPTED," the panel announces. "WELCOME, CAPTAIN BLUSTER. YOU'RE LOOKING MAGNIFICENT TODAY."

The door slides open with a dramatic hiss, revealing the flickering, sparking chaos of DUSTY's Core beyond. The Captain really programmed his own compliments into the security system. Incredible.

The way to DUSTY's Core is now open!`
            };
        }

        return {
            success: false,
            message: "You're not sure where to use the override code here."
        };
    });
}

export default initializePuzzles;
