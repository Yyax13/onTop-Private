export default {
    name: 'reply',
    access: 'level0',
    description: 'Reply any message',
    execute: async (m, mArgs, ctx) => {
        const { textBox, botPrefix } = ctx;

        let targetMessageID = mArgs.shift();
        let channelID = mArgs.shift()?.replace('<', '')?.replace('>', '')?.replace('#', '');
        let text = mArgs.join(' ');

        if (!(targetMessageID || channelID || text)) return m.reply(`Command usage: ${textBox(`${botPrefix}reply <messageID> <channel[where the message was sent]> <text[text to reply]>`)}`);

        try {
            let targetChannel = await m.guild.channels.fetch(channelID);
            let message = await targetChannel.messages.fetch(targetMessageID);

            await m.reply(`Successfuly replied https://discord.com/channels/${m.guild.id}/${channelID}/${targetMessageID}`);
            return await message.reply(text);
            
        } catch (err) {
            const errorMap = {
                10003: 'Unknown Channel (or i haven\' t access)',
                10008: 'Unknown Message (deleted or never exist)'

            };

            return await m.reply(errorMap[err.code] || 'Some error occurred');
        
        };

    }
};