import { it, expect, describe } from 'vitest';
import { danserStdoutParser } from './danserStdoutParser.js';

describe('PANIC', () => {
    it('should parse a panic', () => {
        const stdout =
            '2024/03/05 18:54:20 panic: open C:path\\to\\location: The system cannot find the file specified.';

        const result = danserStdoutParser(stdout);

        expect(result).toEqual({
            type: 'PANIC',
            date: expect.any(Date),
            message: 'panic: open C:path\\to\\location: The system cannot find the file specified.'
        });
    });

    it("should work without a date (fallback to current date if it's invalid)", () => {
        const stdout =
            'panic: open C:path\\to\\location: The system cannot find the file specified.';

        const result = danserStdoutParser(stdout);

        expect(result).toEqual({
            type: 'PANIC',
            date: expect.any(Date),
            message: 'panic: open C:path\\to\\location: The system cannot find the file specified.'
        });
    });
});

describe('INFO', () => {
    it('should parse standard message', () => {
        const stdout = "2024/03/05 18:23:49 You're using the newest version of danser.";

        const result = danserStdoutParser(stdout);

        expect(result).toEqual({
            type: 'INFO',
            date: new Date('2024-03-05T18:23:49Z'),
            message: "You're using the newest version of danser."
        });
    });

    it("should work without a date (fallback to current date if it's invalid)", () => {
        const stdout = "You're using the newest version of danser.";

        const result = danserStdoutParser(stdout);

        expect(result).toEqual({
            type: 'INFO',
            date: expect.any(Date),
            message: "You're using the newest version of danser."
        });
    });
});

describe('FRAME (ffmpeg output)', () => {
    it.each([
        'frame=    1 fps=0.0 q=0.0 size=       0kB time=00:00:00.00 bitrate=N/A speed=   0x',
        'frame=1fps=0.0q=0.0size=0kBtime=00:00:00.00bitrate=N/Aspeed=0x',
        'frame=1fps=0.0q=0.0size=0.00kBtime=00:00:00.00bitrate=N/Aspeed=0x'
    ])('should parse first frame output', (message) => {
        const result = danserStdoutParser(message);

        expect(result).toEqual({
            type: 'FRAME',
            frame: 1,
            fps: 0,
            q: 0,
            sizeKB: 0,
            lastSize: false,
            time: '00:00:00.00',
            KBPerSecond: 0,
            speedMultiplier: 0,
            date: expect.any(Date)
        });
    });

    it.each([
        'frame=  232 fps=0.0 q=22.0 size=       0kB time=00:00:02.85 bitrate=   8kbits/s speed=5.68x',
        'frame=232fps=0.0q=22.0size=0kBtime=00:00:02.85bitrate=8kbits/sspeed=5.68x',
        'frame=232fps=0.0q=22size=0kBtime=00:00:02.85bitrate=8kbits/sspeed=5.68x'
    ])('should parse a frame output with data', (message) => {
        const result = danserStdoutParser(message);

        expect(result).toEqual({
            type: 'FRAME',
            frame: 232,
            fps: 0,
            q: 22,
            sizeKB: 0,
            lastSize: false,
            time: '00:00:02.85',
            KBPerSecond: 1,
            speedMultiplier: 5.68,
            date: expect.any(Date)
        });
    });

    it.each([
        'frame=14184 fps=349 q=22.0 size=  214528kB time=00:03:55.38 bitrate=7466.2kbits/s speed=5.79x',
        'frame=14184fps=349q=22.0size=214528kBtime=00:03:55.38bitrate=7466.2kbits/sspeed=5.79x',
        'frame=14184.00fps=349q=22size=214528kBokomgnowaytime=00:03:55.38bitrate=    7466.200kbits/sspeed=5.79000x'
    ])('should parse a frame output with hefty data', (message) => {
        const result = danserStdoutParser(message);

        expect(result).toEqual({
            type: 'FRAME',
            frame: 14184,
            fps: 349,
            q: 22,
            sizeKB: 214528,
            lastSize: false,
            time: '00:03:55.38',
            KBPerSecond: 933.275,
            speedMultiplier: 5.79,
            date: expect.any(Date)
        });
    });

    it.each([
        'frame=14311 fps=349 RANDOM LOL q=-1.0 Lsize=  215696kB time=00:03:58.46 bitrate=7409.8kbits/s speed=5.81x',
        'frame=14311fps=349q=-1.0Lsize=215696kBtime=00:03:58.46bitrate=7409.8kbits/sspeed=5.81x'
    ])('should parse a frame output with LSize (last size, ffmpeg)', (message) => {
        const result = danserStdoutParser(message);

        expect(result).toEqual({
            type: 'FRAME',
            frame: 14311,
            fps: 349,
            q: -1.0,
            sizeKB: 215696,
            lastSize: true,
            time: '00:03:58.46',
            KBPerSecond: 926.225,
            speedMultiplier: 5.81,
            date: expect.any(Date)
        });
    });
});

describe('PROGRESS', () => {
    it.each([
        '2024/03/05 18:24:27 Progress: 90%, Speed: 5.79x, ETA: 1m2s',
        '2024/03/05 18:24:27 Progress: 90%,Speed:5.79x,ETA:1m2s'
    ])('should parse a progress message', (message) => {
        const result = danserStdoutParser(message);

        expect(result).toEqual({
            type: 'PROGRESS',
            date: new Date('2024-03-05T18:24:27Z'),
            percentage: 90,
            speedMultiplier: 5.79,
            eta: '1m2s'
        });
    });

    it.each([
        '2024/03/05 18:24:27 Progress: 100%, Speed: 5.79x',
        '2024/03/05 18:24:27 Progress: 100%,Speed:5.79x'
    ])('should parse a progress message with 100% and no ETA', (message) => {
        const result = danserStdoutParser(message);

        expect(result).toEqual({
            type: 'PROGRESS',
            date: new Date('2024-03-05T18:24:27Z'),
            percentage: 100,
            speedMultiplier: 5.79,
            eta: null
        });
    });
});
