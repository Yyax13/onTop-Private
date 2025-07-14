import { AttachmentBuilder, EmbedBuilder } from "discord.js";
import { execSync } from 'child_process';

export default {
    name: 'cmd',
    access: 'owner',
    description: 'Run bash commands in bot host (Contabo\'s 20 VPS)',
    execute: async (m, mArgs, ctx) => {
        const { textBox, botPrefix, botClient } = ctx;
        
        let command = mArgs.join(' ');
        let title;
        let content;
        let start = Date.now()

        if (!command) {
            return await m.reply(`Command usage: ${textBox(`${botPrefix}cmd <bash_command>`)}`);

        };

        try {
            let runCommand = execSync(`bash -ic -- "${command} 2>&1"`, { shell: '/bin/bash', stdio: 'pipe', encoding: 'utf8'});

            if (runCommand.length >= 3900) return await m.reply({ files: [new AttachmentBuilder(Buffer.from(runCommand), { name: 'output.txt' })] });

            title = `Successfuly executed \`${command}\``;
            content = `
                \`\`\`bash\n${runCommand}\`\`\`    
            `;

        } catch (err) {
            m.author.send(`
                \`\`\`bash\n${err}\`\`\`
            `).catch(async r => await m.reply('I tried to send the error in your DM, but it\'s closed'));

            title = 'Error'
            content = `
                \`\`\`bash\nSome error happened when executing ${command}\n sent into your DM\`\`\`
            `;

        };

        let end = Date.now();
        let runTime = end -= start;
        let cmdEmbed = new EmbedBuilder()
            .setColor(0x1623cc)
            .setTitle(title)
            .setAuthor({ name: 'Remote Code Executor' })
            .setDescription(content)
            .setTimestamp()
            .addFields({ name: 'Command ran in', value: `${runTime}ms` })
            .setFooter({ text: `By ${botClient.user.displayName}`, iconURL: process.env.T404_LogoLink });
        
        return await m.reply({ embeds: [ cmdEmbed ] });

    }
};