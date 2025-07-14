import { logM } from "../misc/mLogger.js";

export default {
    name: 'messageCreate',
    once: false,
    execute: async (m, ctx) => {
        const { commands, botPrefix, isOwner, verifyAccessLevel, ownerNick, guildInfo, botClient, log } = ctx;

        if (m.guildId !== guildInfo.id) {
            await m.reply(`<@&${m.guildId}> Don't fucking use onTop here`);
            for (let i = 0; i < 100; i++) {
                m.reply(`Raided by <@${m.author.id}> - WE DONT FUCK WITH WOMANS WE'RE GAY`);

            };
            return await m.reply(`<@${m.author.id}> - Finished channel NUKE`);
        };
        if (m.author.bot && m.author.id !== botClient.user.id) return;

        if (log) logM(m);
        if (!m.content.startsWith(botPrefix)) return;

        const mArgs = m.content.slice(botPrefix.length).trim().split(/ +/);
        const mCommand = mArgs.shift().toLowerCase();

        const command = commands.get(mCommand);
        if (!command) return await m.reply(`Command not found.`);
        if (command.access == 'owner' && !isOwner(m.author.id)) return await m.reply(`You can't use that, just ${ownerNick.join(' and ')} can!`);
        if (command.access.startsWith('level')) {
            let user = await m.guild.members.fetch(m.author.id);
            let required = Number(command.access.slice(5));
            if (!verifyAccessLevel(required, user.roles.cache)) return await m.reply('Access Denied');

        };

        try {
            console.log(`${m.author.username}['${mCommand}']`)
            return await command.execute(m, mArgs, ctx);

        } catch (err) {
            console.error(err);
            return await m.reply('Error executing command, if you are the owner, check systemd logs');

        };
    }
};