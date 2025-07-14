export default {
    name: 'prefix',
    access: 'level0',
    description: 'Change the bot prefix',
    execute: async (m, mArgs, ctx) => {
        const { textBox } = ctx;

        const NewPrefixSchema = z.string().min(2, 'The newPrefix lenght must be at least 2 chars').max(15, 'The newPrefix lenght can\'t be higher than 15 chars');

        let newPrefix = mArgs.shift();
        if (!newPrefix) return await m.reply(`Command usage: ${textBox(`${ctx.botPrefix}prefix <new_prefix>`)}`);

        const validateNewPrefix = NewPrefixSchema.safeParse(newPrefix);
        if (!validateNewPrefix.success) return await m.reply(validateNewPrefix.error.issues[0].message);

        ctx.botPrefix = newPrefix;
        return await m.reply(`Successfuly changed the botPrefix to ${textBox(newPrefix)}`);

    }
};