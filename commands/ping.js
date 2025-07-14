import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export default {
    name: 'ping',
    access: 'public',
    description: 'Show the bot connection info',
    execute: async (m, mArgs, ctx) => {
        const { embedCreator, botClient } = ctx;
        
        const pingEmbed = embedCreator('Bot active', `Logged as <@${botClient.user.id}> (${botClient.user.id})`);
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('ping_detail')
                .setLabel('Connection Details')
                .setStyle(ButtonStyle.Primary)
        );

        return await m.reply({ embeds: [pingEmbed], components: [row] });
    }
};