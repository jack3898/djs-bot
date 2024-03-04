import {
    type CommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder
} from 'discord.js';
import { type Command } from 'types/index.js';
import { recordReplayQueue } from 'queues.js';
import { colours, queue, common } from '@bot/constants';
import { env } from 'env.js';
import { storageModel } from 'mongo.js';
import { Bytes } from '@bot/utils';

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
        const replayFileSize = new Bytes(replay?.attachment?.size ?? 0);

        if (!replayUrl) {
            await interaction.reply({
                content: 'No replay file was provided.',
                ephemeral: true
            });

            return;
        }

        const replayCountForUser = await storageModel.countDocuments({
            discordOwnerId: interaction.user.id,
            type: 'mp4'
        });

        if (replayCountForUser >= common.storageLimits.quantityByTier.free) {
            await interaction.reply({
                content:
                    'You have reached your maximum replay limit! Please delete some replays before rendering a new one.',
                ephemeral: true
            });

            return;
        }

        const storageLimitFileSize = common.storageLimits.replayFilesizeByTier.free;

        if (replayFileSize.B > storageLimitFileSize.B) {
            await interaction.reply({
                content: `Replay file is too large. Expected less than ${storageLimitFileSize.kBFriendly}.`,
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

        const jobUrl = new URL(env.SITE_URL);

        jobUrl.pathname = `/jobs/${job.id}`;

        const viewJobButton = new ButtonBuilder()
            .setLabel('View render progress')
            .setStyle(ButtonStyle.Link)
            .setURL(jobUrl.toString()); // TODO: Add job URL when site is live

        const embed = new EmbedBuilder()
            .setTitle('🎥 Job started!')
            .setDescription(
                [
                    `Your request to render an Osu! replay has been acknowledged! It's in the pipeline. 🚀`,
                    `**Job ID**: \`${job.id}\``
                ].join('\n\n')
            )
            .setColor(colours.pink)
            .setFooter({
                text: `Note: the time it takes to finish the replay is dependent on user traffic, replay size, video quality settings, worker availability among other things. Please be patient!`
            });

        const actionRow = new ActionRowBuilder().addComponents(viewJobButton);

        await interaction.reply({
            embeds: [embed],
            // @ts-expect-error - This is a valid interaction reply, but discord.js types are complaining.
            components: [actionRow]
        });

        return;
    }
};
