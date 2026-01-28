/**
 * Item data definitions for Cosmic Custodian
 */

export const items = {
    'mop': {
        name: 'Mop',
        description: 'Your trusty mop leans against the wall.',
        examineText: `Your trusty mop. You've been together for 15 years now - longer than most marriages on this station. Its handle is worn smooth from your grip, and the head has been replaced exactly 47 times.

This mop has cleaned up things that would make a xenobiologist weep. Alien ichor? Check. Reactor coolant? Check. Whatever that thing was in the captain's quarters that one time? You've blocked that memory, but yes, check.

It's more than a cleaning implement. It's a friend. Your only friend, really, if you're being honest.`,
        takeable: true,
        startingRoom: 'cargo-bay-7',
        aliases: ['trusty mop', 'old mop', 'my mop'],
        useWith: ['shelf', 'keycard-cargo', 'disco-ball']
    },

    'bucket': {
        name: 'Bucket',
        description: 'A dented metal bucket sits nearby.',
        examineText: `A standard-issue janitorial bucket, though "standard" is being generous. Every dent tells a story:

- The big one on the side? Asteroid debris during the Proxima incident.
- The one on the bottom? You'd rather not talk about it.
- The smaller dents? Fifteen years of being kicked by ungrateful crew members.

There's still some murky water in the bottom. You're pretty sure something's living in it, but you've come to an understanding - you don't bother it, it doesn't bother you.`,
        takeable: true,
        startingRoom: 'cargo-bay-7',
        aliases: ['metal bucket', 'dented bucket', 'pail']
    },

    'keycard-cargo': {
        name: 'Cargo Keycard',
        description: 'A keycard glints on the high shelf, just out of reach.',
        examineText: `A standard station keycard, marked "CARGO" in faded letters. It's sitting on that high shelf, looking down at you smugly. If keycards could smirk, this one would be smirking.

You could probably reach it if you had something long to knock it down with. Or if you were taller. Or if gravity was more cooperative.`,
        takeable: false,
        cantTakeMessage: `The shelf is too high to reach. Even standing on your tiptoes - which you try, and immediately regret - you can't quite grab it. Maybe you could use something to knock it down?`,
        startingRoom: 'cargo-bay-7',
        aliases: ['keycard', 'card', 'cargo keycard', 'cargo card'],
        hidden: false,
        state: {
            knockedDown: false
        }
    },

    'solvent': {
        name: 'Universal Cleaning Solvent',
        description: 'A bottle of Universal Cleaning Solvent.',
        examineText: `Universal Cleaning Solvent - "For All Your Dissolution Needs!" The label cheerfully proclaims it can dissolve organic matter, inorganic matter, and "most forms of matter that defy classification."

The warning label is longer than most legal documents. Highlights include: "Do not ingest," "Do not apply to skin," "Do not look directly at," and mysteriously, "Do not use on Tuesdays."

This stuff can clean ANYTHING. You've seen it dissolve things that technically shouldn't exist. Perfect for that alien goo blocking the Science Lab door.`,
        takeable: true,
        startingRoom: 'cargo-bay-7',
        aliases: ['solvent', 'cleaning solvent', 'bottle', 'cleaner'],
        useWith: ['goo', 'alien-goo']
    }
};

export default items;
