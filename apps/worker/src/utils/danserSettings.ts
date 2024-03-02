import { danser } from '@bot/constants';
import { exists, makeDir, writeFile } from '@bot/utils';
import { env } from 'env';
import path from 'path';

/**
 * Wrapper around the Danser settings object to provide a more developer-friendly interface for modifying settings.
 * Abstracts away the need to know the exact structure of the Danser settings object.
 * Should the structure of the settings object change, it should be fairly trivial to update this class to work.
 */
export class DanserSettings {
    #settings: danser.DanserDefaultConfig;

    constructor() {
        this.#settings = danser.danserDefaultConfig;

        this.#settings.General.OsuSongsDir = env.DANSER_SONGS_DIR;
        this.#settings.General.OsuReplaysDir = env.DANSER_REPLAYS_DIR;
        this.#settings.General.OsuSkinsDir = env.DANSER_SKINS_DIR;
        this.#settings.Recording.OutputDir = env.DANSER_VIDEOS_DIR;

        // For consistency, just set 1080p as default
        // I don't know if these settings are actually used but just to be safe
        this.#settings.Graphics.Width = 1920;
        this.#settings.Graphics.Height = 1080;
        this.#settings.Graphics.WindowWidth = 1920;
        this.#settings.Graphics.WindowHeight = 1080;

        this.#settings.Recording.FPS = 60;
        this.#settings.Recording.FrameWidth = 1920;
        this.#settings.Recording.FrameHeight = 1080;

        this.#settings.Playfield.Logo.Enabled = false;
    }

    get osuSongsDir(): string {
        return path.resolve(this.#settings.General.OsuSongsDir);
    }

    get osuReplaysDir(): string {
        return path.resolve(this.#settings.General.OsuReplaysDir);
    }

    get osuSkinsDir(): string {
        return path.resolve(this.#settings.General.OsuSkinsDir);
    }

    get recordingOutputDir(): string {
        return path.resolve(this.#settings.Recording.OutputDir);
    }

    setVideoEnabled(enabled: boolean): void {
        this.#settings.Playfield.Background.LoadVideos = enabled;
    }

    setSkin(name: string): void {
        this.#settings.Skin.CurrentSkin = name;
        this.#settings.Skin.UseColorsFromSkin = true;
        this.#settings.Skin.Cursor.UseSkinCursor = true;
    }

    setUseSkinColours(enabled: boolean): void {
        this.#settings.Skin.UseColorsFromSkin = enabled;
    }

    setRecordingWidth(width: number): void {
        this.#settings.Recording.FrameWidth = width;
    }

    setRecordingHeight(height: number): void {
        this.#settings.Recording.FrameHeight = height;
    }

    setRecordingFPS(fps: number): void {
        this.#settings.Recording.FPS = fps;
    }

    get config(): danser.DanserDefaultConfig {
        return this.#settings;
    }

    /**
     * Write the settings to the default.json file in the settings directory.
     */
    async patch(): Promise<void> {
        const settingsDir = path.resolve(env.DANSER_ROOT_DIR, 'settings');
        const settingsDirExists = await exists(settingsDir);

        if (!settingsDirExists) {
            await makeDir(settingsDir, { recursive: true });
        }

        return writeFile(
            path.resolve(settingsDir, 'default.json'),
            JSON.stringify(this.#settings, null, 4)
        );
    }
}
