import { type CommandInteraction } from 'discord.js';
import { usersModel } from 'mongo.js';

export async function isOsuAuthenticated(interaction: CommandInteraction): Promise<boolean> {
    const user = await usersModel.findOne({ discordId: interaction.user.id });

    return !!user?.osuAuth;
}
