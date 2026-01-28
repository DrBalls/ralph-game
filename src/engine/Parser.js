/**
 * Parser class - Interprets player text commands
 */
export class Parser {
    constructor() {
        // Command verbs and their aliases
        this.verbs = {
            'look': ['look', 'l', 'examine', 'inspect', 'check'],
            'examine': ['examine', 'x', 'look at', 'inspect', 'check'],
            'take': ['take', 'get', 'grab', 'pick up', 'pickup'],
            'drop': ['drop', 'put down', 'discard', 'leave'],
            'use': ['use', 'apply', 'activate'],
            'go': ['go', 'walk', 'move', 'head', 'travel'],
            'inventory': ['inventory', 'i', 'inv', 'items'],
            'talk': ['talk', 'talk to', 'speak', 'speak to', 'chat', 'ask'],
            'open': ['open', 'unlock'],
            'close': ['close', 'shut', 'lock'],
            'push': ['push', 'press', 'shove'],
            'pull': ['pull', 'tug', 'yank'],
            'read': ['read', 'peruse'],
            'help': ['help', 'h', '?', 'commands'],
            'save': ['save'],
            'load': ['load', 'restore'],
            'quit': ['quit', 'exit', 'q']
        };

        // Direction shortcuts
        this.directions = {
            'n': 'north',
            's': 'south',
            'e': 'east',
            'w': 'west',
            'u': 'up',
            'd': 'down',
            'north': 'north',
            'south': 'south',
            'east': 'east',
            'west': 'west',
            'up': 'up',
            'down': 'down',
            'ne': 'northeast',
            'nw': 'northwest',
            'se': 'southeast',
            'sw': 'southwest',
            'northeast': 'northeast',
            'northwest': 'northwest',
            'southeast': 'southeast',
            'southwest': 'southwest',
            'in': 'in',
            'out': 'out',
            'enter': 'in',
            'exit': 'out'
        };

        // Words to strip from input
        this.fillerWords = ['the', 'a', 'an', 'at', 'to', 'on', 'in', 'my', 'some'];
    }

    /**
     * Parse a command string into a structured command object
     * @param {string} input - The raw command string
     * @returns {Object} Parsed command {verb, noun, target, raw, error}
     */
    parse(input) {
        if (!input || typeof input !== 'string') {
            return {
                verb: null,
                noun: null,
                target: null,
                raw: input,
                error: "Please enter a command."
            };
        }

        const raw = input.trim();
        let text = raw.toLowerCase();

        // Handle empty input
        if (!text) {
            return {
                verb: null,
                noun: null,
                target: null,
                raw,
                error: "Please enter a command."
            };
        }

        // Check for "USE X WITH Y" pattern first
        const useWithMatch = text.match(/^use\s+(.+?)\s+(?:with|on)\s+(.+)$/i);
        if (useWithMatch) {
            return {
                verb: 'use',
                noun: this.cleanNoun(useWithMatch[1]),
                target: this.cleanNoun(useWithMatch[2]),
                raw
            };
        }

        // Check for "TALK TO X" pattern
        const talkToMatch = text.match(/^(?:talk|speak|chat)\s+to\s+(.+)$/i);
        if (talkToMatch) {
            return {
                verb: 'talk',
                noun: this.cleanNoun(talkToMatch[1]),
                target: null,
                raw
            };
        }

        // Check for "LOOK AT X" pattern
        const lookAtMatch = text.match(/^look\s+at\s+(.+)$/i);
        if (lookAtMatch) {
            return {
                verb: 'examine',
                noun: this.cleanNoun(lookAtMatch[1]),
                target: null,
                raw
            };
        }

        // Check for "GIVE X TO Y" pattern
        const giveToMatch = text.match(/^give\s+(.+?)\s+to\s+(.+)$/i);
        if (giveToMatch) {
            return {
                verb: 'give',
                noun: this.cleanNoun(giveToMatch[1]),
                target: this.cleanNoun(giveToMatch[2]),
                raw
            };
        }

        // Check if it's a bare direction command
        const dirMatch = this.directions[text];
        if (dirMatch) {
            return {
                verb: 'go',
                noun: dirMatch,
                target: null,
                raw
            };
        }

        // Split into words
        const words = text.split(/\s+/);
        const firstWord = words[0];

        // Find the verb
        let verb = this.findVerb(firstWord);

        // If no verb found, check if first word is a direction
        if (!verb) {
            const possibleDir = this.directions[firstWord];
            if (possibleDir) {
                return {
                    verb: 'go',
                    noun: possibleDir,
                    target: null,
                    raw
                };
            }
        }

        // If still no verb, return error
        if (!verb) {
            return {
                verb: null,
                noun: null,
                target: null,
                raw,
                error: `I don't understand "${firstWord}". Type HELP for available commands.`
            };
        }

        // Handle commands that don't need nouns
        if (['inventory', 'help', 'save', 'load', 'quit'].includes(verb)) {
            return {
                verb,
                noun: words.slice(1).join(' ') || null,
                target: null,
                raw
            };
        }

        // Handle 'look' without object (look at room)
        if (verb === 'look' && words.length === 1) {
            return {
                verb: 'look',
                noun: null,
                target: null,
                raw
            };
        }

        // Get the rest as noun phrase
        let nounPhrase = words.slice(1).join(' ');

        // Check if noun contains a direction (for GO command)
        if (verb === 'go') {
            const dir = this.directions[nounPhrase] || this.directions[words[1]];
            if (dir) {
                return {
                    verb: 'go',
                    noun: dir,
                    target: null,
                    raw
                };
            }
            return {
                verb: 'go',
                noun: nounPhrase || null,
                target: null,
                raw,
                error: nounPhrase ? null : "Go where? Try a direction like NORTH, SOUTH, EAST, or WEST."
            };
        }

        // Clean the noun
        const noun = this.cleanNoun(nounPhrase);

        if (!noun && ['take', 'drop', 'use', 'examine', 'open', 'close', 'push', 'pull', 'read'].includes(verb)) {
            return {
                verb,
                noun: null,
                target: null,
                raw,
                error: `${verb.charAt(0).toUpperCase() + verb.slice(1)} what?`
            };
        }

        return {
            verb,
            noun,
            target: null,
            raw
        };
    }

    /**
     * Find the canonical verb from an input word
     * @param {string} word - The word to look up
     * @returns {string|null} The canonical verb, or null if not found
     */
    findVerb(word) {
        const lowerWord = word.toLowerCase();
        for (const [canonical, aliases] of Object.entries(this.verbs)) {
            if (aliases.includes(lowerWord)) {
                return canonical;
            }
        }
        return null;
    }

    /**
     * Clean a noun phrase by removing filler words
     * @param {string} phrase - The noun phrase to clean
     * @returns {string} The cleaned noun
     */
    cleanNoun(phrase) {
        if (!phrase) return null;

        const words = phrase.toLowerCase().split(/\s+/);
        const cleaned = words.filter(word => !this.fillerWords.includes(word));

        return cleaned.join(' ') || phrase.toLowerCase();
    }

    /**
     * Check if a direction is valid
     * @param {string} dir - The direction to check
     * @returns {boolean} Whether the direction is valid
     */
    isValidDirection(dir) {
        return !!this.directions[dir.toLowerCase()];
    }

    /**
     * Get the canonical direction name
     * @param {string} dir - The direction input
     * @returns {string|null} The canonical direction, or null if invalid
     */
    getDirection(dir) {
        return this.directions[dir.toLowerCase()] || null;
    }

    /**
     * Get help text for available commands
     * @returns {string} Help text
     */
    getHelpText() {
        return `Available commands:
LOOK - Examine your surroundings
LOOK AT / EXAMINE [object] - Look at something closely
TAKE / GET [object] - Pick up an item
DROP [object] - Put down an item
USE [object] - Use an item
USE [object] WITH [object] - Use an item with something
INVENTORY (or I) - Check what you're carrying
GO [direction] - Move (N/S/E/W/UP/DOWN or just the direction)
TALK TO [character] - Speak with someone
OPEN / CLOSE [object] - Open or close something
PUSH / PULL [object] - Push or pull something
READ [object] - Read something
SAVE / LOAD - Save or load your game
HELP - Show this message`;
    }
}
