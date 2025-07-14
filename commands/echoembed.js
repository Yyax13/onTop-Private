import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export default {
    name: 'echoembed',
    access: 'level0',
    description: 'Send an embed to any channel',
    execute: async (m, mArgs, ctx) => {
        const { textBox, botPrefix, embedCreator } = ctx;

        const embed = embedCreator('Embed sender', `Do the same thing that ${textBox(`${botPrefix}echo`)} but with embeds`, 'Embed sender');
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('embed_creator')
                .setLabel('Edit embed info')
                .setStyle(ButtonStyle.Primary)
        );

        return await m.reply({ embeds: [embed], components: [row] });
        
    }
};