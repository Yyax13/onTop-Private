export default {
    customId: 'create_submit_embed',
    execute: async (i, ctx) => {
        const { embedCreator } = ctx;
        
        let channelID = i.fields.getTextInputValue('embedTargetChannelID').trim();
        let title = i.fields.getTextInputValue('embedTitle').trim();
        let desc = i.fields.getTextInputValue('embedDesc').trim();
        let pre = i.fields.getTextInputValue('embedPreTitle').trim() || false;
        let color = i.fields.getTextInputValue('embedColor').trim() || false;

        if (color && !(/^0x[0-9a-fA-F]+$/.test(color))) {
            color = false;
            await i.reply({ content: 'Invalid color provided, using default', flags: MessageFlags.Ephemeral });

        };

        let targetChannel = await i.guild.channels.fetch(channelID).catch(() => null);

        if (!targetChannel || !targetChannel.isTextBased()) {
            return await i.reply({ content: 'Invalid channel (or is voice channel). Make shure sending an valid TEXT channel ID', flags: MessageFlags.Ephemeral });

        };

        let embed = pre ? color ? embedCreator(title, desc, pre, color) : embedCreator(title, desc, pre) : embedCreator(title, desc);

        await targetChannel.send({embeds: [embed]});
        return await i.reply({ content: `Successfuly sent your embed to <#${channelID}>`, flags: MessageFlags.Ephemeral });
    }
};
