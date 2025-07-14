import { logMUpdate } from "../misc/mLogger.js";

export default {
    name: 'messageUpdate',
    once: false,
    execute: async (oldM, newM, ctx) => {
        const { guildInfo, botClient, log } = ctx;

        if (oldM.guildId !== guildInfo.id || (oldM.author.bot && oldM.author.id !== botClient.user.id)) return;
        if (log) logMUpdate(oldM, newM);
    }
};