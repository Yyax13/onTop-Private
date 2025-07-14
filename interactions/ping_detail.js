import { MessageFlags } from "discord.js";

export default {
    customId: 'ping_detail',
    execute: async (i, ctx) => {
        const { embedCreator, botClient } = ctx;

        const pingDetailEmbed = embedCreator('Bot connection details', 'Advanced data from bot connection')
            .addFields(
                { name: '📡 API Ping', value: `${botClient.ws.ping}ms`, inline: true },
                { name: '🕒 Uptime', value: `<t:${Math.floor(botClient.readyTimestamp / 1000)}:R>`, inline: true },
                { name: '💾 Memory', value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, inline: true }
            );

        await i.reply({ embeds: [pingDetailEmbed], flags: MessageFlags.Ephemeral });
    }
};
