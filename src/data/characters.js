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
    },

    'chief-krix': {
        id: 'chief-krix',
        name: 'Chief Engineer Krix',
        description: `Chief Engineer Krix is a Delvian - a species known for having four arms, no patience, and an uncanny ability to fix anything with enough duct tape and profanity. She's currently draped over the punch bowl, all four arms dangling limply, still clutching a hydrospanner in one hand.

Even unconscious, she looks annoyed. This is her default expression. You've never seen her smile. You're not sure Delvians CAN smile. It might be physically impossible.

Her engineering jumpsuit is covered in grease stains that predate your employment on this station.`,
        startingRoom: 'ballroom',
        state: 'unconscious',
        dialogue: {
            'unconscious': `Chief Krix is unconscious. Her four arms twitch occasionally, probably dreaming about fixing things. Or yelling at people. Both are equally likely.`,
            'awake': `"Mnrgh... wha... which one of you idiots broke the station this time?" Krix blinks all three of her eyes and focuses on you. "Oh. The janitor. Why am I not surprised? Every time something goes wrong, you're always there. Coincidence? I think NOT."`,
            'default': `Krix crosses two of her arms while the other two continue working on whatever she's holding. "What do you want? I'm busy. The whole station's falling apart and you want to CHAT?"`
        }
    },

    'alien-artifact': {
        id: 'alien-artifact',
        name: 'The Artifact',
        description: `The alien artifact hovers serenely above its pedestal, glowing with colors that shouldn't exist. It hums at a frequency that makes your fillings vibrate. Despite being an inanimate object (probably), it radiates an aura of smug self-satisfaction.

This is the thing that knocked out the entire crew, corrupted the AI, and set the station on a collision course with an alien homeworld. And it seems... proud of itself?`,
        startingRoom: 'science-lab',
        state: 'active',
        dialogue: {
            'active': [
                `The artifact pulses brighter for a moment. You get the distinct impression it's laughing at you. "Tiny cleaning creature. You think you can fix what I have done? How... adorable."`,
                `"I have traversed the void between stars while your species was still learning to walk upright. And you approach me with a... mop?" The artifact's hum takes on a condescending tone.`,
                `"The station's course is set. The AI is scrambled. The crew sleeps. And you, the cleaner of toilets, will save them all? The universe has a sense of humor."`,
                `"I must admit, I didn't expect the janitor to be the last one standing. You're either very lucky or very boring. Possibly both."`,
                `"Yes, yes, keep asking questions. Every moment you waste talking to me is a moment closer to your inevitable collision with Blorgnax Prime. No pressure."`
            ],
            'impressed': [
                `The artifact's glow flickers in what might be surprise. "You... fixed the AI? Without any engineering training? That's... actually impressive. For a janitor."`,
                `"Fine. Fine! You want to redirect the station? You'll need my verification code. The navigation system requires it - a safety measure I installed because I'm not a COMPLETE monster."`,
                `"Here. Take this." A glowing symbol materializes in the air before you. "Use it with your AI. And don't say I never gave you anything."`,
                `"Now go. Save your station. I'll just... sit here. Contemplating how I was outsmarted by someone with a mop. This is very embarrassing for me."`,
                `"Also - don't tell anyone about this. I have a reputation to maintain. 'Defeated by a janitor' is not a good look for an ancient cosmic entity."`
            ],
            'dormant': `The artifact's glow has dimmed considerably. It's still humming, but now it sounds almost... sulky. "Fine. You win this round, janitor. But I'll be back. I'm an ancient cosmic artifact. We're patient."`,
            'default': `The artifact pulses thoughtfully. "You know, for a cleaning professional, you're remarkably resilient. It's almost... admirable. Almost."`
        }
    }
};

export default characters;
