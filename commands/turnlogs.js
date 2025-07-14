export default {
    name: 'turnlogs',
    access: 'owner',
    description: 'Turn bot logs on/off',
    execute: async (m, mArgs, ctx) => {
        ctx.log ? await m.reply('Turning logs off') : await m.reply('Turning logs on');
        ctx.log ? ctx.log = false : ctx.log = true;
        return
        
    }
};