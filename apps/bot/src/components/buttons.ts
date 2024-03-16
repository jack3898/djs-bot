import { ButtonBuilder, ButtonStyle } from 'discord.js';
import { env } from 'env.js';

/**
 * Creates a button that links to the osu! OAuth page.
 */
export async function createLoginWithOsuButton(): Promise<ButtonBuilder> {
    const osuOAuthUrl = new URL(env.SITE_URL);

    osuOAuthUrl.pathname = 'auth/osu/redirect';

    return new ButtonBuilder()
        .setLabel('Link account')
        .setStyle(ButtonStyle.Link)
        .setURL(osuOAuthUrl.toString());
}
