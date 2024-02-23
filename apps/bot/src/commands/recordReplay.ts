import { type CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { type Command } from 'types';
import { recordReplayQueue } from 'queues';
import { KEYS } from '@bot/queue';
import { env } from 'env';

export const recordReplay: Command = {
    get name(): string {
        return this.definition.name;
    },
    // @ts-expect-error - This is a valid definition, but discord.js types are complaining.
    definition: new SlashCommandBuilder()
        .setName('render')
        .setDescription('Generate an Osu! replay using Danser.')
        .addAttachmentOption((option) => {
            return option
                .setName('replay')
                .setDescription('The Osu! replay file to generate the video from.')
                .setRequired(true);
        }),
    async execute(interaction: CommandInteraction): Promise<void> {
        // Discord CDN URL to the replay file
        const replay = interaction.options.get('replay');
        const replayUrl = replay?.attachment?.url;
        const replayFilename = replay?.attachment?.name;
        const fileSize = replay?.attachment?.size ?? 0;

        if (!replayUrl) {
            interaction.reply({
                content: 'No replay file was provided.',
                ephemeral: true
            });

            return;
        }

        const tenMB = 1024 * 1024 * 10;

        if (fileSize > tenMB) {
            await interaction.reply({
                content: 'Replay file is too large. Expected less than 10MB.',
                ephemeral: true
            });

            return;
        }

        await interaction.reply('Queueing job to process replay...');

        await recordReplayQueue.add(KEYS.RECORD, {
            executable: env.DANSER_EXECUTABLE_PATH,
            replayDownloadUrl: replayUrl,
            friendlyName: String(replayFilename),
            discordUserId: interaction.user.id,
            danserOptions: ['--quickstart', `--settings=${env.DANSER_CONFIG_NAME}`]
        });

        await interaction.editReply(
            'Added to the queue! Use /replays to see it. It will not be available immediately.'
        );

        return;
    }
};
