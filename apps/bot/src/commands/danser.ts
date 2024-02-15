import { type CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { type Command } from 'types/Command';
import { runDanser } from '@bot/danser';
import { env } from 'env';
import { deleteFile, download, exists, fromMonorepoRoot, makeDir, writeFile } from '@bot/utils';
import path from 'path';

const { DANSER_CONFIG_NAME, DANSER_EXECUTABLE_PATH, FILES_PATH } = env;

export const danser: Command = {
    get name(): string {
        return this.definition.name;
    },
    // @ts-expect-error - This is a valid definition, but discord.js types are complaining.
    definition: new SlashCommandBuilder()
        .setName('danser')
        .setDescription('Generate an Osu! replay using Danser.')
        .addAttachmentOption((option) => {
            return option
                .setName('replay')
                .setDescription('The Osu! replay file to generate the video from.')
                .setRequired(true);
        }),
    async execute(interaction: CommandInteraction): Promise<void> {
        // Discord CDN URL to the replay file
        const replayUrl = interaction.options.get('replay')?.attachment?.url;

        if (!replayUrl) {
            interaction.reply({
                content: 'No replay file was provided.',
                ephemeral: true
            });

            return;
        }

        const storageDir = fromMonorepoRoot(FILES_PATH);
        const osrLocation = path.join(storageDir, `${interaction.id}.osr`);
        const replayOsrBuffer = await download(new URL(replayUrl));
        const videoFileName = interaction.id;

        if (!(await exists(storageDir))) {
            await makeDir(storageDir, { recursive: true });
        }

        await writeFile(osrLocation, replayOsrBuffer);

        await interaction.reply('Generating the video...');

        // Will migrate this to a queue system in the future
        await runDanser(DANSER_EXECUTABLE_PATH, [
            '--quickstart',
            `--out=${videoFileName}`,
            `--settings=${DANSER_CONFIG_NAME}`,
            `--replay=${osrLocation}`
        ]);

        const videoLocation = fromMonorepoRoot(FILES_PATH, `${videoFileName}.mp4`);

        await interaction
            .followUp({
                content: 'Here is the generated video:',
                files: [videoLocation]
            })
            .catch((error) => {
                return interaction.followUp({
                    content: 'There was a problem sending the video: ' + error.message,
                    ephemeral: true
                });
            })
            .finally(() => {
                return Promise.all([deleteFile(osrLocation), deleteFile(videoLocation)]);
            });
    }
};
