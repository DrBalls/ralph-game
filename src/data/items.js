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
    },

    'wire-cutters': {
        name: 'Wire Cutters',
        description: 'A pair of wire cutters sits on the workbench.',
        examineText: `Standard engineering wire cutters. Sharp, sturdy, and covered in a thin layer of grease that suggests recent use. The handle has "PROPERTY OF ENGINEERING - DO NOT REMOVE" written on it in marker that's almost completely worn off.

You've borrowed these before. "Borrowed." Engineering never noticed. Or if they did, they blamed Jenkins.`,
        takeable: true,
        startingRoom: 'engineering-deck',
        aliases: ['cutters', 'wire cutter', 'tool']
    },

    'maintenance-manual': {
        name: 'Maintenance Manual',
        description: 'A thick maintenance manual sits on a console.',
        examineText: `"Pristine Venture Engineering Guide: When Things Go Wrong (And They Will)" - 4th Edition

The manual is dog-eared and coffee-stained. Someone has annotated the margins extensively with notes like "This doesn't work," "Tried this, made it worse," and "Just hit it."

Chapter 7 is titled "Emergency Power Restoration" and features a helpful diagram of where to insert a power cell. Chapter 12 is titled "What To Do When The AI Goes Insane (Again)."`,
        takeable: true,
        startingRoom: 'engineering-deck',
        aliases: ['manual', 'book', 'guide', 'engineering manual']
    },

    'rubber-gloves': {
        name: 'Rubber Gloves',
        description: 'A pair of rubber gloves hangs by the medical supplies.',
        examineText: `Standard medical-grade rubber gloves. You have a deep professional respect for rubber gloves - they've saved your hands from countless horrifying substances over the years.

These ones are bright yellow and slightly too large, but they'll do. Beggars can't be choosers when dealing with potential biohazards.`,
        takeable: true,
        startingRoom: 'medical-bay',
        aliases: ['gloves', 'medical gloves', 'yellow gloves']
    },

    'ammonia': {
        name: 'Ammonia Solution',
        description: 'A bottle of ammonia solution sits among the medical supplies.',
        examineText: `Medical-grade ammonia solution. The label warns against mixing with other chemicals, which you know from experience is excellent advice that you've ignored many times in your career.

This could be useful. Your janitorial chemistry training is suggesting possibilities...`,
        takeable: true,
        startingRoom: 'medical-bay',
        aliases: ['ammonia', 'ammonia bottle'],
        useWith: ['cloth', 'gloves', 'rubber gloves', 'handkerchief']
    },

    'smelling-salts': {
        name: 'Makeshift Smelling Salts',
        description: 'A rubber glove soaked with ammonia - your improvised smelling salts.',
        examineText: `A rubber glove that you've carefully soaked with ammonia solution. It's not exactly medical-grade smelling salts, but you've worked with worse improvised solutions.

The smell is... potent. Very potent. Your eyes are watering just holding it. This should wake up even the most stubborn sleeper.

Your janitorial chemistry certification is finally paying off.`,
        takeable: true,
        startingRoom: null,
        hidden: true,
        aliases: ['salts', 'smelling salts', 'ammonia glove'],
        useWith: ['doctor', 'dr patchwell', 'patchwell', 'vera']
    },

    'coffee-mug': {
        name: 'Coffee Mug',
        description: 'A clean coffee mug sits on the counter, waiting patiently.',
        examineText: `A standard station-issue coffee mug. It's surprisingly clean considering the state of everything else. The mug bears the Pristine Venture logo and the motto "Excellence Through Caffeination."

Someone has scratched "I survived the budget cuts" on the bottom. Morale has been an issue lately.

This could hold coffee, if only there was a working way to make some...`,
        takeable: true,
        startingRoom: 'mess-hall',
        aliases: ['mug', 'cup', 'coffee cup'],
        useWith: ['synthesizer', 'food synthesizer', 'coffee station']
    },

    'stale-donuts': {
        name: 'Stale Donuts',
        description: 'A box of donuts sits on a table, looking distinctly past their prime.',
        examineText: `A half-empty box of "Space Delights" brand donuts. They were probably brought in for the Captain's Gala and promptly abandoned when actual food arrived.

The donuts have achieved a level of staleness that transcends mere "old." They've entered the realm of "geological." You're pretty sure you could use one as a weapon if necessary.

The box cheerfully proclaims "Now with 50% less sawdust!" You've always wondered what happened to the other 50%.`,
        takeable: true,
        startingRoom: 'mess-hall',
        aliases: ['donuts', 'donut', 'doughnuts', 'doughnut', 'pastries']
    },

    'duct-tape': {
        name: 'Duct Tape',
        description: 'A roll of industrial duct tape sits on a workbench.',
        examineText: `A roll of "Fix-Everything Industrial Duct Tape" - the station's most valuable resource. The label claims it can repair "hulls, hearts, and hope."

You've used this stuff to fix everything from leaky pipes to existential crises. There's a reason Engineering keeps it under lock and key. Well, they USED to keep it under lock and key. Now it's just sitting here.

This is the good stuff - silver, sticky, and strong enough to hold the fabric of reality together. Possibly literally.`,
        takeable: true,
        startingRoom: 'engineering-deck',
        aliases: ['tape', 'silver tape', 'repair tape'],
        useWith: ['synthesizer', 'food synthesizer']
    },

    'caffeinated-sludge': {
        name: 'Caffeinated Sludge',
        description: 'A mug of what the synthesizer considers "coffee" steams ominously.',
        examineText: `The food synthesizer's interpretation of "coffee" is... generous. It's black, it's hot, and it contains enough caffeine to wake the dead. Or at least the unconscious.

The liquid is thick enough that the spoon stands up on its own. There's a faint glow that suggests either bioluminescence or radiation. You decide not to investigate which.

Dr. Patchwell would probably drink motor oil if it had caffeine in it. This should definitely suffice.`,
        takeable: true,
        startingRoom: null,
        hidden: true,
        aliases: ['coffee', 'sludge', 'coffee mug', 'drink'],
        useWith: ['doctor', 'dr patchwell', 'patchwell', 'vera']
    },

    'engineering-keycard': {
        name: 'Engineering Keycard',
        description: 'An Engineering keycard marked with the station logo.',
        examineText: `An official Engineering access keycard. It's marked "ENGINEERING - ALL ACCESS" in bold letters, with Chief Krix's signature on the back.

There's a coffee stain on one corner - probably from Dr. Patchwell. The keycard reader on the Science Lab door should accept this.

With this, you can access the more restricted areas of the station. The plot thickens. Or at least, your access level does.`,
        takeable: true,
        startingRoom: null,
        hidden: true,
        aliases: ['keycard', 'eng keycard', 'access card'],
        useWith: ['door', 'science door', 'science lab']
    }
};

export default items;
