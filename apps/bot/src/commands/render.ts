import { type CommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { type Command } from 'types';
import { recordReplayQueue, recordReplayQueueEvents } from 'queues';
import { colours, queue } from '@bot/constants';

export const render: Command = {
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

        const job = await recordReplayQueue.add(queue.QUEUE_KEYS.RECORD, {
            replayDownloadUrl: replayUrl,
            friendlyName: String(replayFilename),
            discordUserId: interaction.user.id,
            danserOptions: ['--quickstart', `--settings=default`]
        });

        const embed = new EmbedBuilder()
            .setTitle('🎥 Job started!')
            .setDescription(
                `Your request to render an Osu! replay has been acknowledged! It's in the pipeline, and I will let you know once it has finished.\n\nJob ID: \`${job.id}\``
            )
            .setColor(colours.pink)
            .setFooter({
                text: `Note: the time it takes to finish the replay is dependent on user traffic, replay size, video quality settings, worker availability among other things. Live updates are not yet available.`
            });

        await interaction.reply({ embeds: [embed] });

        recordReplayQueueEvents.once('completed', async () => {
            const embed = new EmbedBuilder()
                .setTitle('🎥 completed')
                .setDescription(
                    `You requested an Osu! replay render, and the replay file is ready for download.\n\nJob ID: \`${job.id}\``
                );

            await interaction.user.send({ embeds: [embed] });
        });

        return;
    }
};
