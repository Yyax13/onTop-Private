export default {
    name: 'reset',
    access: 'owner',
    description: 'Reset the bot in ten secs (back to default prefix, turn on logs and u',
    execute: async (m, mArgs, ctx) => {
        await m.reply('Bot restaring in ten secs (back to default prefix, restart loggin and update commands)');
        setTimeout(() => {
            console.log('[onTopBot] Restart triggered via reset command');
            process.exit(0);
        }, 1000);
        
    }
};