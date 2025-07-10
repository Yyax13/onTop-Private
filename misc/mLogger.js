import crypto from 'crypto';
import fsPromises from 'fs/promises';
import fs from 'fs';
import { log } from './logger.js';
import { AttachmentBuilder } from 'discord.js';

const supportedHashes = crypto.getHashes();

function encodeBase64(str) {
    return Buffer.from(str, 'utf8').toString('base64');
}

function hashMD5(str) {
    return crypto.createHash('md5').update(str).digest('hex');
}

function hashSHA(type, str) {
    if (!supportedHashes.includes(type)) return 'unsupported';
    return crypto.createHash(type).update(str).digest('hex');
}

function applyAllHashes(str) {
    return {
        md5: hashMD5(str),
        sha256: hashSHA('sha256', str),
    };
}

async function logM(m) {
    const messageTimestamp_ptBR = new Date().toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: 'numeric',
    });
    const messageTimestamp_UTC = new Date().toUTCString();

    let messageLog = {
        message: {
            id: m.id,
            content: m.content,
            attachments: m.attachments,
            stickers: m.stickers,
            embeds: m.embeds,
            channel: m.channel.name,
            channelId: m.channelId
        },
        author: {
            id: m.author.id,
            userName: m.author.username,
            displayName: m.author.displayName,
            avatar: m.author.avatar,
            bot: m.author.bot
        },
        timestamps: {
            ptBR: messageTimestamp_ptBR,
            UTC: messageTimestamp_UTC
        },
        proofs: {
            hashes: {}
        }
    };
    const payloadStr = JSON.stringify({
        messageContent: messageLog.message.content,
        authorId: messageLog.author.id,
        timestamps: messageLog.timestamps
    });

    messageLog.proofs.hashes = applyAllHashes(payloadStr);
    messageLog.proofs.base64 = encodeBase64(payloadStr);
    if (!fs.existsSync('./logs/messages')) fs.mkdirSync('./logs/messages');
    await fsPromises.appendFile(`./logs/messages/${messageLog.author.id}.log`, JSON.stringify(messageLog, null, 4) + '\n');
    await log(`Message sent (${messageLog.message.id}): ${messageLog.message.content}`, messageLog.author.id, messageLog.author.userName);

};

async function logMDelete(m) {
    const messageTimestamp_ptBR = new Date().toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: 'numeric',
    });
    const messageTimestamp_UTC = new Date().toUTCString();

    let messageLog = {
        message: {
            id: m.id,
            content: m.content,
            attachments: m.attachments,
            stickers: m.stickers,
            embeds: m.embeds,
            channel: m.channel.name,
            channelId: m.channelId
        },
        author: {
            id: m.author.id,
            userName: m.author.username,
            displayName: m.author.displayName,
            avatar: m.author.avatar,
            bot: m.author.bot
        },
        timestamps: {
            ptBR: messageTimestamp_ptBR,
            UTC: messageTimestamp_UTC
        },
        proofs: {
            hashes: {}
        }
    };
    const payloadStr = JSON.stringify({
        messageContent: messageLog.message.content,
        authorId: messageLog.author.id,
        timestamps: messageLog.timestamps
    });

    messageLog.proofs.hashes = applyAllHashes(payloadStr);
    messageLog.proofs.base64 = encodeBase64(payloadStr);
    if (!fs.existsSync('./logs/deletes')) fs.mkdirSync('./logs/deletes');
    await fsPromises.appendFile(`./logs/deletes/${messageLog.author.id}.log`, JSON.stringify(messageLog, null, 4) + '\n');
    await log(`Message deleted (${messageLog.message.id}): ${messageLog.message.content}`, messageLog.author.id, messageLog.author.userName);
    
};

async function logMUpdate(oldM, newM) {
    const messageTimestamp_ptBR = new Date().toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: 'numeric',
    });
    const messageTimestamp_UTC = new Date().toUTCString();

    let messageLog = {
        message: {
            id: oldM.id,
            oldContent: oldM.content,
            oldAttachments: oldM.attachments,
            oldStickers: oldM.stickers,
            oldEmbeds: oldM.embeds,
            newContent: newM.content,
            newAttachments: newM.attachments,
            newStickers: newM.stickers,
            newEmbeds: newM.embeds,
            editedAt: newM.editedAt,
            channel: oldM.channel.name,
            channelId: oldM.channelId
        },
        author: {
            id: oldM.author.id,
            userName: oldM.author.username,
            displayName: oldM.author.displayName,
            avatar: oldM.author.avatar,
            bot: oldM.author.bot
        },
        timestamps: {
            ptBR: messageTimestamp_ptBR,
            UTC: messageTimestamp_UTC
        },
        proofs: {
            hashes: {}
        }
    };
    const payloadStr = JSON.stringify({
        messageOldContent: messageLog.message.oldContent,
        messageNewContent: messageLog.message.newContent,
        authorId: messageLog.author.id,
        timestamps: messageLog.timestamps
    });

    messageLog.proofs.hashes = applyAllHashes(payloadStr);
    messageLog.proofs.base64 = encodeBase64(payloadStr);
    if (!fs.existsSync('./logs/updates')) fs.mkdirSync('./logs/updates');
    await fsPromises.appendFile(`./logs/updates/${messageLog.author.id}.log`, JSON.stringify(messageLog, null, 4) + '\n');
    await log(`Message updated (${messageLog.message.id}): from "${messageLog.message.oldContent}" to "${messageLog.message.newContent}"`, messageLog.author.id, messageLog.author.userName);
    
};

async function fetchLogs(userId, m, deep=false) {
    if (!fs.existsSync(`./logs/${userId}.log`)) return await m.reply(`That user haven't logs yet :)`);

    const logFileData = await fsPromises.readFile(`./logs/${userId}.log`);
    const user = await m.guild.members.fetch(userId);
    const username = user.user.username;

    if (!deep) {
        try {
            await m.author.send({
                files: [
                    new AttachmentBuilder(Buffer.from(logFileData), {
                        name: `${userId}.log` 
                    })

                ]

            });
            return await m.reply(`Successfuly sent the log in your DM :)`)
            
        } catch (err) {
            return await m.reply(`Some error occured during log send, make shure that your DM is open`);

        };
    };
    
    const messagesFileData = fs.existsSync(`./logs/messages/${userId}.log`) ? await fsPromises.readFile(`./logs/messages/${userId}.log`) : Buffer.from(`User ${username} haven't this type of log`);
    const updatesFileData = fs.existsSync(`./logs/updates/${userId}.log`) ? await fsPromises.readFile(`./logs/updates/${userId}.log`) : Buffer.from(`User ${username} haven't this type of log`);
    const deletesFileData = fs.existsSync(`./logs/deletes/${userId}.log`) ? await fsPromises.readFile(`./logs/deletes/${userId}.log`) : Buffer.from(`User ${username} haven't this type of log`);

    try {
        await m.author.send({
            files: [
                new AttachmentBuilder(Buffer.from(logFileData, 'utf8'), { name: `${userId}.log` }),
                new AttachmentBuilder(Buffer.from(messagesFileData, 'utf8'), { name: `messages.log` }),
                new AttachmentBuilder(Buffer.from(updatesFileData, 'utf8'), { name: `updates.log` }),
                new AttachmentBuilder(Buffer.from(deletesFileData, 'utf8'), { name: `deletes.log` })

            ]

        });
        return await m.reply(`Successfuly sent all the logs in your DM :)`)
        
    } catch (err) {
        console.error(err);
        return await m.reply(`Some error occured during logs send, make shure that your DM is open`);

    };

};

export { logM, logMDelete, logMUpdate, fetchLogs };
