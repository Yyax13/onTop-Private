export default {
    name: 'sudohelper',
    access: 'level0',
    description: 'Show all commands reserved too level0 users and their functions',
    execute: async (m, mArgs, ctx) => {
        const { embedCreator } = ctx;

        let helpEmbed = embedCreator('Avaliable Commands', 'A list of all avaliable commands')
            .addFields(
                { name: `[STABLE] ${botPrefix}prefix`, value: 'Change the bot prefix' },
                { name: `[STABLE] ${botPrefix}reset`, value: 'Reset the bot in ten seconds (back to the default prefix ( t? ), patch to any update and turn on logs' },
                { name: `[STABLE] ${botPrefix}turnlogs`, value: 'Turn the server logs on/off' },
                { name: `[BETA] ${botPrefix}cmd`, value: 'Execute bash commands in bot\'s host' },
                { name: `[INFO] ${botPrefix}sudohelper`, value: 'Show this menu' }
            );

        return await m.reply({ embeds: [helpEmbed] });
        
    }
};