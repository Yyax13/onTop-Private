import 'dotenv/config';
import { 
    Client,
    Events,
    GatewayIntentBits,
    EmbedBuilder,
    Partials,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle, 
    MessageFlags,
    AttachmentBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle

} from 'discord.js';
import { findSubdomains } from './misc/sub.js';
import { z } from 'zod';
import { logM, logMDelete, logMUpdate, fetchLogs } from './misc/mLogger.js';
import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';

const botToken = process.env.DC_BotToken;
const botClient = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction
    ],
    rest: {
        requestTimeout: 30000
    }
});

const ownerInfo = {
    id: '1126922339699933194',
    name: 'hoWoLindoDemais'
};

const level0 = [
    '1388890236901396570',
    '1387117644221644922',
    '1387117647644332043',
    '1387117648864612484'
    
];

const level1 = [
    ...level0,
    '1392921582573453392',
    '1392930078442393710',
    '1392950631224053770',
    '1392180120004853760',
    '1387117649972170844',
    '1387117654124527656',
    '1387117652631097506',
    '1392213017160192083',
    '1389671571148247222',
    '1392183190080327971',
    '1389716338871767101',
    '1390018166742188093',

];

const level2 = [
    ...level1,
    '1388634625634471996',
    '1387117659065155587'

];

const verifyAccessLevel0 = (userRoles) => {
    return level0.some(roleId => userRoles.has(roleId));

};

const verifyAccessLevel1 = (userRoles) => {
    return level1.some(roleId => userRoles.has(roleId));

};

const verifyAccessLevel2 = (userRoles) => {
    return level2.some(roleId => userRoles.has(roleId));

};

let botPrefix = "t?"; // t404&¨¬
let log = true;

botClient.once(Events.ClientReady, readyClient => {
    console.log(`[?] Logged as ${readyClient.user.tag}`);
    if (!existsSync('./logs')) mkdirSync('./logs');
});

const textBox = (message) => { return `\`${message}\``; };
const embedCreator = (title, desc, botName=botClient.user.displayName, color=0x1623cc, thumb = process.env.T404_LogoLink) => {
    return new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
        .setAuthor({ name: botName })
        .setDescription(desc)
        .setThumbnail(thumb)
        .setTimestamp()
        .setFooter({ text: `By ${botClient.user.displayName}`, iconURL: thumb });
};

botClient.on('messageCreate', async (m) => {
    if (m.guildId !== '1387116520479391944' || (m.author.bot && m.author.id !== botClient.user.id)) return;
    
    log ? logM(m).catch(err => console.error(err)) : null;
    if (!m.content.startsWith(botPrefix)) return;

    console.log(`${m.author.username} ['${m.content}']`);
    const mArgs = m.content.slice(botPrefix.length).trim().split(/ +/);
    const mCommand = mArgs.shift().toLowerCase();

    const avaliableCommands = {
        ping: async () => {
            const pingEmbed = embedCreator('Bot active', `Logged as <@${botClient.user.id}> (${botClient.user.id})`);
            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('ping_detail')
                    .setLabel('Connection Details')
                    .setStyle(ButtonStyle.Primary)
            );

            return await m.reply({ embeds: [pingEmbed], components: [row] });

        },
        echo: async () => {
            let userId = m.author.id;
            let user = await m.guild.members.fetch(userId);
            if (!verifyAccessLevel0(user.roles.cache)) {
                return await m.reply("You can't use this");

            };

            let targetChannelID = mArgs.shift()?.replace('<', '')?.replace('>', '')?.replace('#', '');
            let message = mArgs.join(' ');

            if (!targetChannelID || !message) return await m.reply(`Command usage: ${textBox(`${botPrefix}echo <channel_id> <text>`)}`);

            let targetChannel = await m.guild.channels.fetch(targetChannelID).catch(() => null);

            if (!targetChannel || !targetChannel.isTextBased()) {
                return await m.reply('Invalid channel (or is voice channel). Make shure sending an valid TEXT channel ID');

            };

            return await targetChannel.send(message)
                .then(() => m.reply(`Successfuly sent your message to <#${targetChannelID}>`))
                .catch(async (err) => {
                    console.error(err);

                    await m.reply('Some error happen when i tried send the message');

                });

        },
        reply: async () => {
            let userId = m.author.id;
            let user = await m.guild.members.fetch(userId);
            if (!verifyAccessLevel0(user.roles.cache)) {
                return await m.reply("You can't use this");

            };

            let targetMessageID = mArgs.shift();
            let channelID = mArgs.shift()?.replace('<', '')?.replace('>', '')?.replace('#', '');
            let text = mArgs.join(' ');

            if (!(targetMessageID || channelID || text)) return m.reply(`Command usage: ${textBox(`${botPrefix}reply <messageID> <channel[where the message was sent]> <text[text to reply]>`)}`);

            try {
                let targetChannel = await m.guild.channels.fetch(channelID);
                let message = await targetChannel.messages.fetch(targetMessageID);

                await m.reply(`Successfuly replied https://discord.com/channels/${m.guild.id}/${channelID}/${targetMessageID}`);
                return await message.reply(text);
                
            } catch (err) {
                const errorMap = {
                    10003: 'Unknown Channel (or i haven\' t access)',
                    10008: 'Unknown Message (deleted or never exist)'

                };

                return await m.reply(errorMap[err.code] || 'Some error occurred');
            
            };

        },
        echoembed: async () => {
            let userId = m.author.id;
            let user = await m.guild.members.fetch(userId);
            if (!verifyAccessLevel0(user.roles.cache)) {
                return await m.reply("You can't use this");

            };

            const embed = embedCreator('Embed sender', `Do the same thing that ${textBox(`${botPrefix}echo`)} but with embeds`, 'Embed sender');
            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('embed_creator')
                    .setLabel('Edit embed info')
                    .setStyle(ButtonStyle.Primary)
            );

            return await m.reply({ embeds: [embed], components: [row] });

        },
        b64: async () => {
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

        },
        prefix: async () => {
            let userId = m.author.id;
            let user = await m.guild.members.fetch(userId);
            if (!verifyAccessLevel0(user.roles.cache)) {
                return await m.reply("You can't use this");

            };

            const NewPrefixSchema = z.string().min(2, 'The newPrefix lenght must be at least 2 chars').max(15, 'The newPrefix lenght can\'t be higher than 15 chars');

            let newPrefix = mArgs.shift();

            const validateNewPrefix = NewPrefixSchema.safeParse(newPrefix);
            if (!validateNewPrefix.success) return await m.reply(validateNewPrefix.error.issues[0].message);

            botPrefix = newPrefix;
            return await m.reply(`Successfuly changed the botPrefix to ${textBox(newPrefix)}`);

        },
        subs: async () => {
            let target = mArgs.shift();
            let mode = mArgs.shift();

            if (!target || !mode) return await m.reply(`Command usage: ${textBox(`${botPrefix}subs <target_domain> <mode[low,mid,high,test]> <optional_concurrency?>`)}`);

            const ModeSchema = z.enum(['low', 'mid', 'high', 'test'], { errorMap: (ctx, issue) => ({ message: 'The "mode" must be low, mid, high or test (just 7 subs)' }) });
            const validateMode = ModeSchema.safeParse(mode);
            if (!validateMode.success) return await m.reply(validateMode.error.issues[0].message);

            let concurrencyRaw = mArgs.shift();
            if (concurrencyRaw && !/^\d+?/) return await m.reply('The concurrency must be an number');

            let concurrency = concurrencyRaw ? Number(concurrencyRaw) : null;
            const ConcurrencySchema = z.number().min(1, "Concurrency must be at least 1").max(650, "Concurrency can't be higher than 650").nonnegative("Concurrency can't be negative").nullish();

            const validateConcurrency = ConcurrencySchema.safeParse(concurrency);
            if (!validateConcurrency.success) return await m.reply(validateConcurrency.error.issues[0].message);

            if (!/^(?!:\/\/)([a-zA-Z0-9-_]+\.)+[a-zA-Z]{2,}$/.test(target)) return await m.reply('The target must be an valid domain (e.g.: example.com)');

            await m.reply(`Starting subdomain finding in ${target}`);

            const subs = concurrency ? await findSubdomains(target, mode, m, { concurrency: concurrency }) : await findSubdomains(target, mode, m);

            subs.forEach(async (v) => {
                let addressesStr = Array.isArray(v.addresses) ? v.addresses.join(', ') : (v.addresses !== null && v.addresses !== undefined ? String(v.addresses) : 'N/A');
                let resultEmbed = embedCreator('Subdomain found', 'Details:')
                    .addFields(
                        { name: 'Subdomain:', value: String(v.subdomain) },
                        { name: 'Type:', value: String(v.type), inline: true },
                        { name: 'Addresses:', value: addressesStr, inline: true },
                        { name: 'httpStatus:', value: v.httpStatus !== undefined && v.httpStatus !== null ? String(v.httpStatus) : 'N/A', inline: true },
                        { name: 'httpReachable:', value: v.httpReachable !== undefined && v.httpReachable !== null ? String(v.httpReachable) : 'N/A', inline: true }
                    );

                await m.channel.send({ content: `<@${m.author.id}>`, embeds: [resultEmbed] });
                try {
                    await m.author.send({ embeds: [resultEmbed] });
                
                } catch (err) {
                    await m.reply('Can\'t send messages to you, because your private messages option is set to deny messages if sender is not your friend');

                }
            });

            let totalA = (subs.filter(v => v && v.type == 'A')).length;
            let totalAAAA = (subs.filter(v => v && v.type == 'AAAA')).length;
            let totalANY = (subs.filter(v => v && v.type == 'ANY')).length;
            let totalCNAME = (subs.filter(v => v && v.type == 'CNAME')).length;
            let totalMX = (subs.filter(v => v && v.type == 'MX')).length;
            let totalNS = (subs.filter(v => v && v.type == 'NS')).length;
            let totalTXT = (subs.filter(v => v && v.type == 'TXT')).length;
            let totalUNKNOWN = (subs.filter(v => v && v.type == 'UNKNOWN (Not Resolved)')).length;

            let totalResultEmbed = embedCreator(`Subdomains in ${target}`, 'Recon lookup:')
                .addFields(
                    { name: 'Subdomain DNS type A:', value: String(totalA), inline: true },
                    { name: 'Subdomain DNS type AAAA:', value: String(totalAAAA), inline: true },
                    { name: 'Subdomain DNS type ANY:', value: String(totalANY), inline: true },
                    { name: 'Subdomain DNS type CNAME:', value: String(totalCNAME), inline: true },
                    { name: 'Subdomain DNS type MX:', value: String(totalMX), inline: true },
                    { name: 'Subdomain DNS type NS:', value: String(totalNS), inline: true },
                    { name: 'Subdomain DNS type TXT:', value: String(totalTXT), inline: true },
                    { name: 'Subdomain DNS type UNKNOWN (Not Resolved):', value: String(totalUNKNOWN), inline: true }
                );

            await m.reply({ embeds: [totalResultEmbed] });
            try {
                await m.author.send({ embeds: [totalResultEmbed] });
            
            } catch (err) {
                await m.reply('Can\'t send messages to you, because your private messages option is set to deny messages if sender is not your friend');

            }

        },
        reset: async () => {
            if (m.author.id !== ownerInfo.id) return await m.reply(`You can't use this, just ${ownerInfo.name} can use this`);

            await m.reply('Bot restaring in three secs (back to default prefix, restart loggin and update commands)');
            setTimeout(() => process.exit(0), 1000);

        },
        turnlogs: async () => {
            if (m.author.id !== ownerInfo.id) return await m.reply(`You can't use this, just ${ownerInfo.name} can use this`);

            log ? await m.reply('Turning logs off') : await m.reply('Turning logs on');
            log ? log = false : log = true;
            return

        },
        cmd: async () => {
            if (m.author.id !== ownerInfo.id) return await m.reply(`You can't use this, just ${ownerInfo.name} can use this`);
            let command = mArgs.join(' ');
            let title;
            let content;
            let start = Date.now()

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
            
            return await m.reply({ embeds: [ cmdEmbed ] })
            // return await m.reply(`## ${title}\n\n${content}\n> Command ran in ${runTime}`);

        },
        fetchlogs: async () => {
            let userId = m.author.id;
            let user = await m.guild.members.fetch(userId);
            if (!verifyAccessLevel2(user.roles.cache)) {
                m.reply('You can\'t use that');

            };

            const deep = verifyAccessLevel1(user.roles.cache);
            let targetUser = mArgs.shift()?.replace('<', '')?.replace('>', '')?.replace('@', '');

            if (!targetUser) return m.reply(`Command Usage: ${textBox(`${botPrefix}fetchlogs <userID or mention>`)}`);
            let exists = await m.guild.members.fetch(targetUser).then(success => true).catch(err => false)

            if(exists) return await fetchLogs(targetUser, m, deep); return await m.reply('User not found');

        },
        help: async () => {
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

        },
        sudohelper: async () => {
            let userId = m.author.id;
            let user = await m.guild.members.fetch(userId);
            if (!verifyAccessLevel0(user.roles.cache)) {
                return await m.reply("You can't use this");

            };
            
            let helpEmbed = embedCreator('Avaliable Commands', 'A list of all avaliable commands')
                .addFields(
                    { name: `[STABLE] ${botPrefix}prefix`, value: 'Change the bot prefix' },
                    { name: `[STABLE] ${botPrefix}reset`, value: 'Reset the bot in three seconds (back to the default prefix ( t? ), patch to any update and turn on logs' },
                    { name: `[STABLE] ${botPrefix}turnlogs`, value: 'Turn the server logs on/off' },
                    { name: `[BETA] ${botPrefix}cmd`, value: 'Execute bash commands in bot\'s host' },
                    { name: `[INFO] ${botPrefix}sudohelper`, value: 'Show this menu' }
                );

            return await m.reply({ embeds: [helpEmbed] });
        }

    };

    if (avaliableCommands[mCommand]) avaliableCommands[mCommand]();
    else return await m.reply(`Command not found, use ${textBox(`${botPrefix}help`)} to view avaliable commands`);

});

botClient.on('messageDelete', async (m) => {
    if (m.guildId !== '1387116520479391944' || m.author.bot) return;

    log ? logMDelete(m) : null;
});

botClient.on('messageUpdate', async (oldM, newM) => {
    if (oldM.guildId !== '1387116520479391944' || oldM.author.bot) return;

    log ? logMUpdate(oldM, newM) : null;

});

botClient.on('interactionCreate', async (i) => {
    if (!i.isButton) return;
    
    const avaliableInteractions = {
        ping_detail: async () => {
            const pingDetailEmbed = embedCreator('Bot connection details', 'Advanced data from bot connection')
                .addFields(
                    { name: '📡 API Ping', value: `${botClient.ws.ping}ms`, inline: true },
                    { name: '🕒 Uptime', value: `<t:${Math.floor(botClient.readyTimestamp / 1000)}:R>`, inline: true },
                    { name: '💾 Memory', value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, inline: true }
                );

            await i.reply({ embeds: [pingDetailEmbed], flags: MessageFlags.Ephemeral })
        },
        embed_creator: async () => {
            const modal = new ModalBuilder()
                .setCustomId('create_submit_embed')
                .setTitle('Embed editor');
            
            const channelID  = new TextInputBuilder()
                .setCustomId('embedTargetChannelID')
                .setLabel('Target channel ID')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const titleInput = new TextInputBuilder()
                .setCustomId('embedTitle')
                .setLabel('Embed title')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);
            
            const descInput = new TextInputBuilder()
                .setCustomId('embedDesc')
                .setLabel('Embed description')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);
            
            const preTitleInput = new TextInputBuilder()
                .setCustomId('embedPreTitle')
                .setLabel('Small heading above title (3~4 words)')
                .setStyle(TextInputStyle.Short)
                .setRequired(false);
            
            const colorInput = new TextInputBuilder()
                .setCustomId('embedColor')
                .setLabel('Embed color (in hex, e.g: 0x1623cc)')
                .setStyle(TextInputStyle.Short)
                .setRequired(false)

            const channelIDRow = new ActionRowBuilder().addComponents(channelID);
            const titleInputRows = new ActionRowBuilder().addComponents(titleInput);
            const descInputRows = new ActionRowBuilder().addComponents(descInput);
            const preTitleInputRow = new ActionRowBuilder().addComponents(preTitleInput);
            const colorInputRow = new ActionRowBuilder().addComponents(colorInput);

            modal.addComponents(channelIDRow, titleInputRows, descInputRows, preTitleInputRow, colorInputRow);

            return await i.showModal(modal);
            
        },
        create_submit_embed: async () => {
            let channelID = i.fields.getTextInputValue('embedTargetChannelID').trim();
            let title = i.fields.getTextInputValue('embedTitle').trim();
            let desc = i.fields.getTextInputValue('embedDesc').trim();
            let pre = i.fields.getTextInputValue('embedPreTitle').trim() || false;
            let color = i.fields.getTextInputValue('embedColor').trim() || false;

            if (color && !(/^0x[0-9a-fA-F]+$/.test(color))) {
                color = false;
                await i.reply({ content: 'Invalid color provided, using default', flags: MessageFlags.Ephemeral });

            };

            let targetChannel = await i.guild.channels.fetch(channelID).catch(() => null);

            if (!targetChannel || !targetChannel.isTextBased()) {
                return await i.reply({ content: 'Invalid channel (or is voice channel). Make shure sending an valid TEXT channel ID', flags: MessageFlags.Ephemeral });

            };

            let embed = pre ? color ? embedCreator(title, desc, pre, color) : embedCreator(title, desc, pre) : embedCreator(title, desc);

            await targetChannel.send({embeds: [embed]});
            return await i.reply({ content: `Successfuly sent your embed to <#${channelID}>`, flags: MessageFlags.Ephemeral });

        }
    };

    avaliableInteractions[i.customId] ? avaliableInteractions[i.customId]() : () => {return};
});

botClient.login(botToken);
