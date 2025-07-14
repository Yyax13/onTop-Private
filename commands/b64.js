export default {
    name: 'b64',
    access: 'public',
    description: 'Encode and decode in Base64 format',
    execute: async (m, mArgs, ctx) => {
        const { textBox, botPrefix } = ctx;

        let action = mArgs.shift();
        let content = action == 'encode' ? mArgs.join(' ') : mArgs.shift();

        if (!action || !content || (action && !(action == 'encode' || action == 'decode'))) return await m.reply(`Command usage: ${textBox(`${botPrefix}b64 <action[encode,decode]> <text[if encode, use just utf-8 chars]>`)}`);

        action = action.toLowerCase();

        const actionMap = {
            encode: async (str) => {
                try {
                    let strB64 = Buffer.from(str, 'utf-8').toString('base64');

                    return await m.reply(`Successfuly encoded your text to base64: ${textBox(strB64)}`);

                } catch (err) {
                    console.error(err);

                    return await m.reply('Some error happened during encode, check your <text> and try again');

                };
            },
            decode: async (str) => {
                try {
                    let strDecoded = Buffer.from(str, 'base64').toString('utf-8');

                    return await m.reply(`Successfuly decoded your base64 string: ${textBox(strDecoded)}`);

                } catch (err) {
                    console.error(err);

                    return await m.reply('Some error happened during decode, check if your <text> is an valid base64 string and try again');

                }
            }
        };

        await actionMap[action](content);
        
    }
};