export default {
    name: 'echo',
    access: 'level0',
    description: 'Send an message to any channel',
    execute: async (m, mArgs, ctx) => {
        const { textBox, botPrefix } = ctx;

        let targetChannelID = mArgs.shift()?.replace('<', '')?.replace('>', '')?.replace('#', '');
        let message = mArgs.join(' ');

        if (!targetChannelID || !message) return await m.reply(`Command usage: ${textBox(`${botPrefix}echo <channel_id> <text>`)}`);

        let targetChannel = await m.guild.channels.fetch(targetChannelID).catch(() => null);

        if (!targetChannel || !targetChannel.isTextBased()) {
            return await m.reply('Invalid channel (or is voice channel). Make shure sending an valid TEXT channel ID');

        };

        return await targetChannel.send(message)
            .then(() => m.reply(`Successfuly sent your message to <#${targetChannelID}>`))
            .catch(async (err) => {
                console.error(err);

                await m.reply('Some error happen when i tried send the message');

            });
    }
};