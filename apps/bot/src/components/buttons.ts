import { ButtonBuilder, ButtonStyle } from 'discord.js';
import { env } from 'env.js';
import { jwt } from 'jwt.js';

/**
 * Creates a button that links to the osu! OAuth page.
 */
export async function createLoginWithOsuButton(discordId: string): Promise<ButtonBuilder> {
    const osuSearchParams = new URLSearchParams({
        client_id: env.OSU_CLIENT_ID,
        redirect_uri: env.OSU_REDIRECT_URI.toString(),
        response_type: 'code',
        scope: 'public',
        state: await jwt.sign({ discordId: discordId }, { expiresIn: '5m' })
    });

    const osuOAuthUrl = new URL(`https://osu.ppy.sh/oauth/authorize`);

    osuOAuthUrl.search = osuSearchParams.toString();

    return new ButtonBuilder()
        .setLabel('Link account')
        .setStyle(ButtonStyle.Link)
        .setURL(osuOAuthUrl.toString());
}
