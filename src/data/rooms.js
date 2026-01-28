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
            west: 'engineering-corridor'
        },
        features: {
            'goo': `Pulsing, iridescent alien goo. It smells faintly of burnt toast and something unidentifiable. You've cleaned up a lot of strange substances in your career, but this one takes the cake. It seems almost... alive? Best not to think about that.`,
            'signs': `Emergency signs point to various locations: Bridge (North), Medical Bay (East), Engineering (West), Cargo (South). The "You Are Here" dot has been replaced with a sad face emoji. You don't remember authorizing that modification.`,
            'walls': `The usually pristine white walls are covered in scorch marks and that weird goo. You're going to need a LOT of Universal Cleaning Solvent for this. Maybe THE DISSOLVER.`,
            'lights': `The emergency lights flicker in an almost rhythmic pattern. Is the station trying to tell you something? Or is this just standard "everything is failing" behavior? Hard to tell anymore.`
        },
        image: 'main-corridor.png'
    }
};

export default rooms;
