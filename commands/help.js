export default {
    name: 'help',
    access: 'public',
    description: 'Show all public commands and their uses',
    execute: async (m, mArgs, ctx) => {
        const { embedCreator, botPrefix, textBox } = ctx;

        let helpEmbed = embedCreator('Avaliable Commands', 'A list of all avaliable commands')
            .addFields(
                { name: `[STABLE] ${botPrefix}ping`, value: 'Show the bot connection info' },
                { name: `[STABLE] ${botPrefix}echo`, value: 'Send any message to the channel that you choose' },
                { name: `[STABLE] ${botPrefix}b64`, value: 'Base64 encode & decode' },
                { name: `[BETA] ${botPrefix}subs`, value: 'Subdomain finder with 3 levels (low, mid, high)' },
                { name: `[BETA] ${botPrefix}fetchlogs`, value: 'Fetch all logs from any user' },
                { name: `[INFO] ${botPrefix}sudohelper`, value: `Show an menu like this, but with commands that only the staff and/or the owner can use (e.g.: ${textBox(`${botPrefix}reset`)})` },
                { name: `[INFO] ${botPrefix}help`, value: 'Show this menu' }
            );

        return await m.reply({ embeds: [helpEmbed] });
        
    }
};