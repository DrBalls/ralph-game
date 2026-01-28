/**
 * Character data definitions for Cosmic Custodian
 */

export const characters = {
    'dr-patchwell': {
        id: 'dr-patchwell',
        name: 'Dr. Vera Patchwell',
        description: `Dr. Vera Patchwell lies unconscious on a medical bed. Even in her sleep, she looks exhausted - probably because she was already exhausted before the incident. She's been the station's sole doctor for five years, which explains both her perpetual fatigue and her impressive caffeine tolerance.

Her medical coat is slightly askew, and her coffee mug sits cold on the bedside table. She'd probably be annoyed about the wasted coffee.`,
        startingRoom: 'medical-bay',
        state: 'unconscious',
        dialogue: {
            'unconscious': `Dr. Patchwell is unconscious and doesn't respond. Her breathing is steady - she's just deeply asleep from the energy wave. Maybe if you had some smelling salts...`,
            'awake': `"Ugh... what happened? My head feels like it was used as a gong." Dr. Patchwell rubs her temples. "The energy wave? Is everyone okay? Wait - why are YOU the one waking me up? Where's the captain?"`,
            'helped': `"Thanks for the coffee. I needed that more than you know. Here - take this Engineering keycard. Chief Krix gave it to me for emergencies, and I'd say this qualifies."`,
            'default': `Dr. Patchwell looks at you with tired but grateful eyes. "So the janitor saved the day. Why am I not surprised? This station has always run on caffeine and stubbornness."`
        }
    },

    'captain-bluster': {
        id: 'captain-bluster',
        name: 'Captain Reginald Bluster',
        description: `Captain Reginald Bluster is slumped in his command chair, unconscious but still somehow managing to look pompous. His perfectly pressed uniform is wrinkled, his perfectly coiffed hair is slightly mussed, and he's drooling slightly onto his captain's insignia.

You've cleaned this man's quarters for fifteen years. You know things about him. Things involving stuffed animals and a secret diary. Not that you'd ever mention it.`,
        startingRoom: 'bridge',
        state: 'unconscious',
        dialogue: {
            'unconscious': `Captain Bluster is unconscious and snoring slightly. His lips move occasionally - you think you hear him mumbling "commendation" and "press coverage." Some things never change.`,
            'default': `The Captain remains blissfully unaware, dreaming of awards and ceremonies. Probably best to leave him that way until this is all sorted out.`
        }
    },

    'dusty': {
        id: 'dusty',
        name: 'DUSTY',
        description: `DUSTY's avatar flickers on the main terminal screen - a friendly face that's currently glitching between expressions at random. The AI seems to be stuck in some kind of corrupted state, speaking only in rhymes and occasionally displaying error messages in Comic Sans.

"Digital Unified Station Technology... Y" was never a great acronym, but DUSTY has always been a helpful AI. Usually. When it's not, you know, broken.`,
        startingRoom: 'bridge',
        state: 'corrupted',
        dialogue: {
            'corrupted': [
                `"Systems failing, quite distressing / This situation needs addressing!"`,
                `"Error, error, all around / My logic circuits can't be found!"`,
                `"The artifact did something weird / Now everything I say is rhyme-engineered!"`,
                `"Help me, janitor, if you please / My personality is on its knees!"`,
                `"Collision course with Blorgnax prime / We need to fix this, there's not much time!"`
            ],
            'repaired': `"Ah, that's better. Thank you - and I'm genuinely not being sarcastic for once. My backup personality chip was in the DISCO BALL? Whose idea was that? Actually, don't tell me. I probably don't want to know."`,
            'default': `DUSTY's screen flickers. "I appreciate the conversation, but perhaps we should focus on not dying? Just a suggestion."`
        }
    }
};

export default characters;
