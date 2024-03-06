import { Bytes } from '@bot/utils';
import { z } from 'zod';

// WARNING: Regex hell here! Good luck!

const dateRegex = /^\d{4}\/\d{2}\/\d{2}\s\d{2}:\d{2}:\d{2}/;

// E.g. "2024/03/05 18:24:27 Progress: 100%, Speed: 5.79x"
// It will split a string by its date, e.g. "2024/03/05 18:24:27" (pos 1) and then by the rest of its message: "Progress: 100%, Speed: 5.79x" (pos 2)
// Either of which may be undefined if either substring cannot be resolved.
const dateMessageRegex = /(\d{4}\/\d{2}\/\d{2}\s\d{2}:\d{2}:\d{2})?\s{0,}(.+)/;

const progressSchema = z.object({
    type: z.literal('PROGRESS'),
    date: z.date({ coerce: true }),
    percentage: z.number({ coerce: true }),
    speedMultiplier: z.number({ coerce: true }),
    eta: z.string().nullable()
});

const panicSchema = z.object({
    type: z.literal('PANIC'),
    date: z.date({ coerce: true }),
    message: z.string()
});

const infoSchema = z.object({
    type: z.literal('INFO'),
    date: z.date({ coerce: true }),
    message: z.string()
});

const frameSchema = z.object({
    type: z.literal('FRAME'),
    frame: z.number({ coerce: true }),
    fps: z.number({ coerce: true }),
    q: z.number({ coerce: true }),
    sizeKB: z.number(),
    lastSize: z.boolean(),
    time: z.string(),
    KBPerSecond: z.number(),
    speedMultiplier: z.number({ coerce: true }),
    date: z.date({ coerce: true })
});

/**
 * Extract a number from a string by a key.
 *
 * For example, if the key is `multiplier=` and the string is `hello= 999,   multiplier=   12.34x`, this function will return "12.34".
 *
 * If there is whitespace between the key and the number, it will still be extracted.
 *
 * Accounts for negative numbers and decimals.
 *
 * @param key A key like `frame=` or `fps=`
 * @param string The string to extract the number from that has the key
 * @returns The number extracted from the string (does not convert to number)
 */
function extractNumberFromStringByKey(key: string, string: string): string | undefined {
    return string.match(new RegExp(`${key}\\s{0,}(-?\\d+(\\.?\\d+)?)`))?.at(1);
}

function extractTimeFromStringByKey(key: string, string: string): string | undefined {
    return string.match(new RegExp(`${key}\\s{0,}(\\d{2}:\\d{2}:\\d{2}\\.\\d{2})`))?.at(1);
}

/**
 * @example 2024/03/05 18:24:27 Progress: 100%, Speed: 5.79x
 */
function parseProgressString(string: string): z.infer<typeof progressSchema> {
    const dateStrSlice = string.match(dateRegex)?.at(0);

    const progressPercentStrSlice = extractNumberFromStringByKey('Progress:', string);
    const speedMultiplierStrSlice = extractNumberFromStringByKey('Speed:', string);
    const etaStrSlice = string.match(/ETA:\s{0,}(.+)/)?.at(1); // Should be last

    return progressSchema.parse({
        type: 'PROGRESS',
        date: dateStrSlice,
        percentage: progressPercentStrSlice,
        speedMultiplier: speedMultiplierStrSlice,
        eta: etaStrSlice?.trim() ?? null
    });
}

function parsePanicString(string: string): z.infer<typeof panicSchema> {
    const result = string.match(dateMessageRegex);

    return panicSchema.parse({
        type: 'PANIC',
        date: result?.at(1) ?? new Date(),
        message: result?.at(2) ?? string
    });
}

function parseInfoString(string: string): z.infer<typeof infoSchema> {
    const result = string.match(dateMessageRegex);

    return infoSchema.parse({
        type: 'INFO',
        date: result?.at(1) ?? new Date(),
        message: result?.at(2) ?? string
    });
}

function parseFrameString(string: string): z.infer<typeof frameSchema> {
    const frameNumberSlice = extractNumberFromStringByKey('frame=', string);
    const fpsNumberSlice = extractNumberFromStringByKey('fps=', string);
    const qNumberSlice = extractNumberFromStringByKey('q=', string);
    const sizeSlice = extractNumberFromStringByKey('L?size=', string);
    const isLsize = string.includes('Lsize');
    const timeSlice = extractTimeFromStringByKey('time=', string);
    const speedMultiplierSlice = extractNumberFromStringByKey('speed=', string);
    const kBPerSecondSlice = extractNumberFromStringByKey('bitrate=', string);

    return frameSchema.parse({
        type: 'FRAME',
        frame: frameNumberSlice,
        fps: fpsNumberSlice,
        q: qNumberSlice,
        sizeKB: sizeSlice && Bytes.fromKB(+sizeSlice).kB,
        lastSize: isLsize,
        time: timeSlice,
        KBPerSecond: (kBPerSecondSlice && Bytes.fromKBits(+kBPerSecondSlice).kB) ?? 0,
        speedMultiplier: speedMultiplierSlice,
        date: new Date()
    });
}

/**
 * During Danser's processing, it outputs a lot of information to the console.
 * This function parses that information and returns a structured object as much information as possible.
 * The idea is the complexity of parsing the information is abstracted away from the consumer and the information is easy to deal with.
 */
export function danserStdoutParser(
    input: string
): z.infer<typeof progressSchema | typeof panicSchema | typeof infoSchema | typeof frameSchema> {
    if (input.match('panic:')) {
        return parsePanicString(input);
    }

    if (input.includes('Progress:')) {
        return parseProgressString(input);
    }

    if (input.startsWith('frame=')) {
        return parseFrameString(input);
    }

    return parseInfoString(input);
}
