/**
 * Room data definitions for Cosmic Custodian
 */

export const rooms = {
    'cargo-bay-7': {
        name: 'CARGO BAY 7',
        description: `You are in the cramped confines of Cargo Bay 7, surrounded by crates of cleaning supplies and spare parts. The emergency lighting casts everything in a dim red glow, making the whole place look like it's blushing in embarrassment.

A toilet sits in the corner - your unlikely savior from the energy wave that knocked out the rest of the crew. You were cleaning it when everything went sideways. The irony is not lost on you.

Cleaning equipment is scattered about: your trusty mop, a bucket that's seen better decades, and various bottles of chemicals that could probably strip paint off a battleship. High above, a keycard glints on a metal shelf, mocking your average human height.`,
        connections: {
            east: 'cargo-corridor'
        },
        features: {
            'toilet': `The toilet that saved your life. A standard Sanitation Solutions Model 7 "The Liberator." You were elbow-deep in its innards when the energy wave hit. The ceramic bowl apparently blocked the chaotic energy, leaving you as the only conscious being on the entire station. You've always said this toilet was special. Now you have proof.`,
            'crates': `Stacks of crates labeled "Cleaning Supplies - Hazmat Level 3" and "Spare Parts - Do Not Eat." Typical cargo bay stuff. One crate is labeled "Captain's Personal Wine Collection - FRAGILE" in red letters. Figures.`,
            'shelf': `A high metal shelf mounted to the wall. Something's glinting up there - looks like a keycard. It's just out of reach. Story of your life, really. The good stuff is always on the top shelf.`,
            'lighting': `Emergency lighting flickers ominously, casting red shadows across everything. It's like being inside a very boring nightclub. The main power must be fluctuating.`,
            'supplies': `Bottles of Universal Cleaning Solvent, Grime-Away Pro, and something simply labeled "THE DISSOLVER" in warning yellow. Your tools of the trade. That last one requires a license in three systems.`,
            'mop': `Your trusty mop leans against the wall, waiting for you like a loyal pet. You've been through a lot together.`,
            'bucket': `A dented metal bucket sits nearby. It's seen fifteen years of service and every dent tells a story, mostly about you dropping it.`
        },
        image: 'cargo-bay-7.png'
    },

    'cargo-corridor': {
        name: 'CARGO BAY CORRIDOR',
        description: `A narrow corridor connects Cargo Bay 7 to the rest of the station. Emergency lights flicker overhead in an arrhythmic pattern that would drive a musician insane. You can hear the distant hum of failing systems - never a comforting sound.

Cables hang from the ceiling where panels have been knocked loose by the energy wave. Scorch marks decorate the walls in abstract patterns that could probably sell for millions in some pretentious art gallery. "Post-Apocalyptic Expressionism," you'd call it.

A sign on the wall helpfully points north toward the Main Corridor, though someone has graffitied "CERTAIN DOOM" underneath it. Probably Jenkins from Engineering. He always was dramatic.`,
        connections: {
            west: 'cargo-bay-7',
            north: 'main-corridor'
        },
        features: {
            'cables': `Sparking cables dangle dangerously from the ceiling. You've filed seventeen work orders about these exact cables over the past two years. Management said they'd "get to it." Well, look who's laughing now. Actually, nobody is laughing. This is serious.`,
            'panels': `Wall panels knocked loose by the energy wave, revealing the station's guts - a tangle of wires, pipes, and what you're pretty sure is a family of space mice that have been living rent-free in the walls.`,
            'sign': `A standard station directional sign. "Main Corridor - North." Below it, someone has added "CERTAIN DOOM" in what appears to be permanent marker. You recognize Jenkins' handwriting.`,
            'scorch': `Scorch marks on the walls from the energy wave. They form interesting patterns. One of them kind of looks like Captain Bluster's face, if you squint. Not sure if that's meaningful or just your subconscious expressing itself.`
        },
        image: 'cargo-corridor.png'
    },

    'main-corridor': {
        name: 'MAIN CORRIDOR',
        description: `The main corridor of the Pristine Venture stretches before you, though "Pristine" is doing a lot of heavy lifting right now. Emergency signs flicker overhead, and the usual immaculate white walls are now decorated with scorch marks and pulsing alien goo that smells faintly of burnt toast and existential dread.

This is the central hub of the station - or was, before everything went sideways. Doors lead off in multiple directions, each one a potential adventure or a horrible death. In your experience, usually both.

The lights flicker in a pattern that almost seems intentional, as if the station itself is trying to communicate through morse code. If so, it's just repeating "HELP" over and over.`,
        connections: {
            south: 'cargo-corridor',
            north: 'bridge',
            east: 'medical-bay',
            west: {
                roomId: 'engineering-corridor',
                locked: true,
                requiredKey: 'keycard-cargo',
                lockedMessage: 'The door to Engineering is locked. It has a keycard reader with "CARGO" written above it. Apparently, Engineering counts as "cargo" in some bureaucratic sense.'
            },
            up: 'mess-hall',
            down: 'science-lab-corridor'
        },
        features: {
            'goo': `Pulsing, iridescent alien goo. It smells faintly of burnt toast and something unidentifiable. You've cleaned up a lot of strange substances in your career, but this one takes the cake. It seems almost... alive? Best not to think about that.`,
            'signs': `Emergency signs point to various locations: Bridge (North), Medical Bay (East), Engineering (West), Cargo (South), Mess Hall (Up via stairs), Science Lab (Down via stairs). The "You Are Here" dot has been replaced with a sad face emoji. You don't remember authorizing that modification.`,
            'walls': `The usually pristine white walls are covered in scorch marks and that weird goo. You're going to need a LOT of Universal Cleaning Solvent for this. Maybe THE DISSOLVER.`,
            'lights': `The emergency lights flicker in an almost rhythmic pattern. Is the station trying to tell you something? Or is this just standard "everything is failing" behavior? Hard to tell anymore.`,
            'door': `The door to Engineering is a heavy blast door with a keycard reader. Above the reader, someone has helpfully labeled it "CARGO ACCESS REQUIRED." Because apparently, Engineering is considered cargo storage. Station bureaucracy at its finest.`,
            'engineering door': `The door to Engineering is a heavy blast door with a keycard reader. Above the reader, someone has helpfully labeled it "CARGO ACCESS REQUIRED." Because apparently, Engineering is considered cargo storage. Station bureaucracy at its finest.`
        },
        image: 'main-corridor.png'
    },

    'engineering-corridor': {
        name: 'ENGINEERING CORRIDOR',
        description: `You're in the corridor leading to Engineering. The air here is noticeably warmer, and you can feel a subtle vibration through the floor from the station's power systems. Various pipes and conduits line the walls, most of them labeled with warnings you've learned to ignore.

A few of the pipes are leaking steam, which adds a dramatic atmosphere but is probably terrible for the station's efficiency ratings. Someone has stuck a "We'll Fix It Eventually" sticky note on one of them. It's dated three years ago.

The smell of ozone and machine oil hangs in the air. It's the smell of Engineering - a place where miracles are performed daily and nobody thanks you for it.`,
        connections: {
            east: 'main-corridor',
            west: 'engineering-deck'
        },
        features: {
            'pipes': `Various pipes carry coolant, fuel, and what you suspect might be the captain's private hot cocoa supply. Most are labeled. Some labels are crossed out and replaced with cryptic notes like "DO NOT TOUCH - JENKINS" and "DEFINITELY NOT HOT COCOA."`,
            'steam': `Steam hisses from a leaky pipe. It's been doing this for at least three years, based on that sticky note. You've reported it twelve times. It's become a personal rivalry at this point.`,
            'note': `A faded sticky note reads: "We'll Fix It Eventually - Engineering Dept." It's dated three years ago. You admire their optimism.`
        },
        image: 'engineering-corridor.png'
    },

    'engineering-deck': {
        name: 'ENGINEERING DECK',
        description: `The heart of the Pristine Venture's power systems spreads before you in all its chaotic glory. Reactor controls blink with warning lights that have been blinking so long everyone's stopped noticing them. The main power conduit hums ominously, occasionally sparking in ways that definitely violate several safety codes.

A large power cell slot sits empty next to the emergency generator. Someone has placed a "Please Insert Power Cell" sign on it, which strikes you as optimistically passive-aggressive.

The emergency power is clearly failing - half the displays are dead, and the ones that work keep flickering through error messages. You've seen this before. You've cleaned up after this before.`,
        connections: {
            east: 'engineering-corridor'
        },
        features: {
            'reactor': `The main reactor controls. Most of the readouts are in the red, but to be fair, most readouts on this station are always in the red. It's almost comforting at this point.`,
            'power cell slot': `An empty slot for an emergency power cell. The sign above it reads "INSERT POWER CELL HERE" with an arrow pointing down. Below that, someone added "No, seriously, we need one." The slot is clearly designed for a standard power cell.`,
            'conduit': `The main power conduit sparks occasionally. You've reported this 23 times. Maintenance says it's "within acceptable parameters." Define "acceptable," you'd like to ask.`,
            'displays': `Half the displays are dead. The working ones cycle through error messages: "POWER CRITICAL," "COOLANT LOW," and mysteriously, "HAVE YOU TRIED TURNING IT OFF AND ON AGAIN?"`,
            'wire cutters': `A pair of wire cutters sits on the workbench. Standard engineering tool. Looks recently used.`,
            'manual': `A thick maintenance manual sits on a nearby console. The cover reads "Pristine Venture Engineering Guide: When Things Go Wrong (And They Will)."`
        },
        image: 'engineering-deck.png'
    },

    'medical-bay': {
        name: 'MEDICAL BAY',
        description: `The Medical Bay is eerily quiet except for the soft beeping of life support monitors. Medical beds line the walls, most of them empty. The sterile white surfaces are still pristine - apparently the energy wave was polite enough to leave the medical equipment alone.

Dr. Vera Patchwell lies unconscious on one of the beds, her perpetually tired expression somehow even more tired while she's asleep. Her coffee mug sits on the bedside table, long since cold.

Medical supplies line the shelves - bandages, medicines, and several bottles of chemicals that you recognize from your advanced cleaning certification course. Those could be useful.`,
        connections: {
            west: 'main-corridor'
        },
        features: {
            'beds': `Standard medical beds with built-in life support. Most are empty. One contains Dr. Patchwell, looking exhausted even while unconscious.`,
            'monitors': `Life support monitors beep steadily. Everyone's vital signs are stable - just unconscious. Small mercies.`,
            'supplies': `Medical supplies including bandages, antiseptic, and... is that ammonia? And vinegar? Your cleaning instincts are tingling.`,
            'coffee': `Dr. Patchwell's coffee mug. Stone cold now. The mug reads "I Went to Medical School For This?" You feel a kinship.`,
            'chemicals': `Various chemical compounds. Your trained eye spots ammonia solution and some other reagents. With your janitorial chemistry knowledge, you could probably make smelling salts.`
        },
        image: 'medical-bay.png'
    },

    'bridge': {
        name: 'BRIDGE',
        description: `The bridge of the Pristine Venture would be impressive if half the consoles weren't sparking and the viewscreen wasn't displaying what can only be described as "aggressive static with attitude."

Captain Reginald Bluster slumps in his command chair, unconscious but still somehow radiating pomposity. His perfectly pressed uniform is wrinkled for perhaps the first time in his career. You'd feel bad, but he did call you "the mop person" at last year's crew evaluation.

DUSTY's main terminal dominates one wall, its screen flickering with corrupted text. The AI seems to be stuck in some kind of loop, occasionally muttering in rhymes.

Through the static on the viewscreen, you can just make out the approaching Blorgnax Homeworld. This is bad.`,
        connections: {
            south: 'main-corridor'
        },
        features: {
            'viewscreen': `The main viewscreen crackles with static, but through it you can see the Blorgnax Homeworld growing larger. ETA: approximately "too soon."`,
            'consoles': `Navigation consoles spark and flicker. Most show ERROR messages. One optimistically displays "COLLISION COURSE CONFIRMED!" with a smiley face. You're going to have words with whoever programmed that.`,
            'chair': `The captain's chair, currently occupied by the unconscious Captain Bluster. It's a really nice chair. You've dusted it many times.`,
            'dusty': `DUSTY's terminal. The AI's avatar flickers on screen, occasionally spouting rhyming nonsense. "Systems failing, quite distressing / This situation needs addressing!" Not helpful, DUSTY.`,
            'captain': `Captain Reginald Bluster, unconscious and slightly drooling on his command chair. His perfect hair is finally out of place. You resist the urge to take a photo.`
        },
        image: 'bridge.png'
    },

    'science-lab-corridor': {
        name: 'SCIENCE LAB CORRIDOR',
        description: `A short corridor leads to the Science Lab. Or rather, it would lead there, if the doorway wasn't completely blocked by a massive wall of pulsating alien goo. The stuff is the same iridescent, burnt-toast-smelling substance you saw in the Main Corridor, but here it's formed an impenetrable barrier.

The goo pulses with an internal light, occasionally forming shapes that might be faces, or might just be your imagination running away with you. Either way, it's disturbing.

A sign next to the door reads "SCIENCE LAB - AUTHORIZED PERSONNEL ONLY." The goo seems unimpressed by the sign.`,
        connections: {
            west: 'main-corridor',
            east: {
                roomId: 'science-lab',
                locked: true,
                requiredKey: null,
                lockedMessage: 'The doorway is completely blocked by alien goo. The stuff pulses and gurgles when you get close, as if daring you to try. Maybe something could dissolve it?'
            }
        },
        features: {
            'goo': `The alien goo forms a solid wall across the doorway. It's warm to the touch (you checked, regrettably) and seems almost alive. Your professional assessment: this is a mess that needs cleaning.`,
            'alien goo': `The alien goo forms a solid wall across the doorway. It's warm to the touch (you checked, regrettably) and seems almost alive. Your professional assessment: this is a mess that needs cleaning.`,
            'sign': `"SCIENCE LAB - AUTHORIZED PERSONNEL ONLY." Below it, someone has written "This means you, Jenkins." Jenkins must have been really unpopular.`,
            'door': `You can barely see the door behind all that goo. It's a heavy blast door, probably locked too, but the goo is the more immediate problem.`
        },
        image: 'science-lab-corridor.png'
    },

    'science-lab': {
        name: 'SCIENCE LAB',
        description: `The Science Lab is ground zero for the chaos that's gripped the station. Equipment lies scattered, consoles spark intermittently, and in the center of it all sits THE ARTIFACT.

The alien artifact hovers a few inches above its containment pedestal, glowing with an inner light that shifts between colors your brain insists shouldn't exist. It hums at a frequency that makes your teeth itch.

Scattered around the room are notes, data pads, and what appears to be someone's lunch (now mutated into something that's eating the container). The scientists clearly left in a hurry when things went wrong.

Despite the chaos, this is actually one of the cleaner rooms you've seen. The artifact's energy wave seems to have organized certain things while destroying others. Very inconsiderate of it.`,
        connections: {
            west: 'science-lab-corridor'
        },
        features: {
            'artifact': `The alien artifact. The thing that started all this. It's about the size of a basketball, covered in intricate patterns that seem to shift when you're not looking directly at them. It hums smugly, as if it knows exactly what it did and isn't sorry.`,
            'alien artifact': `The alien artifact. The thing that started all this. It's about the size of a basketball, covered in intricate patterns that seem to shift when you're not looking directly at them. It hums smugly, as if it knows exactly what it did and isn't sorry.`,
            'pedestal': `A high-tech containment pedestal designed to keep the artifact stable. It's doing an... adequate job, considering the artifact is still glowing and humming ominously.`,
            'consoles': `Scientific consoles blink with error messages and readings that are either very wrong or very right in ways no one understands anymore.`,
            'notes': `Scientific notes scattered everywhere. Most are too technical to understand, but you spot phrases like "unprecedented energy readings," "consciousness patterns??" and "ORDER MORE COFFEE - URGENT."`,
            'lunch': `What was once someone's lunch has mutated into a small, purple blob that's slowly consuming its container. It looks at you (how? It doesn't have eyes) and makes a sound that might be a greeting. You decide to leave it alone.`
        },
        image: 'science-lab.png'
    },

    'mess-hall': {
        name: 'MESS HALL',
        description: `The Mess Hall of the Pristine Venture is a study in culinary disappointment even on the best of days. Today, with half the lights flickering and the food synthesizer making sounds that can only be described as "digestively concerning," it's somehow worse.

Tables are scattered with half-finished meals - the crew was clearly interrupted mid-bite by the energy wave. Someone's soup has congealed into what might be a new life form. You decide not to investigate.

The main food synthesizer dominates one wall, sparking occasionally and emitting a smell that's somewhere between "burnt toast" and "existential regret." A sign above it reads "Satisfaction Guaranteed!*" with an asterisk that leads to very fine print.

At least the coffee station looks intact. Some things are sacred, even in a crisis.`,
        connections: {
            down: 'main-corridor'
        },
        features: {
            'synthesizer': `The food synthesizer sparks and wheezes like an asthmatic robot. Its display flickers between "READY TO SERVE" and "CRITICAL MALFUNCTION" in an indecisive loop. Something inside it is making a grinding noise that doesn't inspire confidence. It looks like it needs some basic repairs - maybe some duct tape could hold it together long enough to produce something edible. Or at least something that won't immediately cause food poisoning.`,
            'food synthesizer': `The food synthesizer sparks and wheezes like an asthmatic robot. Its display flickers between "READY TO SERVE" and "CRITICAL MALFUNCTION" in an indecisive loop. Something inside it is making a grinding noise that doesn't inspire confidence. It looks like it needs some basic repairs - maybe some duct tape could hold it together long enough to produce something edible. Or at least something that won't immediately cause food poisoning.`,
            'tables': `Mess hall tables, each one a frozen snapshot of interrupted meals. Someone was having the "Mystery Protein Surprise" - you've cleaned up enough of that to know it's neither mysterious nor surprising. Just disappointing.`,
            'soup': `The abandoned soup has developed a skin on top that you're pretty sure just blinked at you. Best to leave it alone. Some messes are better left uncleaned.`,
            'sign': `"Satisfaction Guaranteed!*" The asterisk leads to fine print: "*Satisfaction not guaranteed. Pristine Ventures Inc. is not responsible for taste, texture, nutritional content, or any existential crises caused by consumption."`,
            'coffee station': `The coffee station appears mercifully intact. There's even a clean mug waiting there, as if fate knew you'd need caffeine to deal with this situation. The station can produce coffee... if only the synthesizer was working.`,
            'meals': `Half-eaten meals litter the tables. The variety is impressive in its mediocrity - synthesized "steak," reconstituted "vegetables," and something labeled "Nutrition Block Alpha" that looks like a brick of sadness.`
        },
        image: 'mess-hall.png'
    }
};

export default rooms;
