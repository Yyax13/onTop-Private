import { logMDelete } from "../misc/mLogger.js";

export default {
    name: 'messageDelete',
    once: false,
    execute: async (m, ctx) => {
        const { guildInfo, botClient, log } = ctx;

        if (m.guildId !== guildInfo.id || (m.author.bot && m.author.id !== botClient.user.id)) return;
        if (log) logMDelete(m);
    }
};