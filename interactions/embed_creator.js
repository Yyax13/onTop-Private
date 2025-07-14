import { ModalBuilder, TextInputBuilder, ActionRowBuilder } from "discord.js";

export default {
    customId: 'embed_creator',
    execute: async (i, ctx) => {
        const modal = new ModalBuilder()
            .setCustomId('create_submit_embed')
            .setTitle('Embed editor');
        
        const channelID  = new TextInputBuilder()
            .setCustomId('embedTargetChannelID')
            .setLabel('Target channel ID')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const titleInput = new TextInputBuilder()
            .setCustomId('embedTitle')
            .setLabel('Embed title')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);
        
        const descInput = new TextInputBuilder()
            .setCustomId('embedDesc')
            .setLabel('Embed description')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);
        
        const preTitleInput = new TextInputBuilder()
            .setCustomId('embedPreTitle')
            .setLabel('Small heading above title (3~4 words)')
            .setStyle(TextInputStyle.Short)
            .setRequired(false);
        
        const colorInput = new TextInputBuilder()
            .setCustomId('embedColor')
            .setLabel('Embed color (in hex, e.g: 0x1623cc)')
            .setStyle(TextInputStyle.Short)
            .setRequired(false)

        const channelIDRow = new ActionRowBuilder().addComponents(channelID);
        const titleInputRows = new ActionRowBuilder().addComponents(titleInput);
        const descInputRows = new ActionRowBuilder().addComponents(descInput);
        const preTitleInputRow = new ActionRowBuilder().addComponents(preTitleInput);
        const colorInputRow = new ActionRowBuilder().addComponents(colorInput);

        modal.addComponents(channelIDRow, titleInputRows, descInputRows, preTitleInputRow, colorInputRow);

        return await i.showModal(modal);
        
    }
};
