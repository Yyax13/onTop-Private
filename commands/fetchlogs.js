export default {
    name: 'fetchlogs',
    access: 'level2',
    description: 'Fetch all logs from any user',
    execute: async (m, mArgs, ctx) => {
        const { verifyAccessLevel, textBox, botPrefix } = ctx;

        const deep = verifyAccessLevel(1, user.roles.cache);
        let targetUser = mArgs.shift()?.replace('<', '')?.replace('>', '')?.replace('@', '');

        if (!targetUser) return m.reply(`Command Usage: ${textBox(`${botPrefix}fetchlogs <userID or mention>`)}`);
        let exists = await m.guild.members.fetch(targetUser).then(success => true).catch(err => false)

        if(exists) return await fetchLogs(targetUser, m, deep); return await m.reply('User not found');

    }
};