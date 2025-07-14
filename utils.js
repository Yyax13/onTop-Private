import fs from 'fs';
const configData = JSON.parse(fs.readFileSync(new URL('./config.json', import.meta.url)));
import { EmbedBuilder } from "discord.js";
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const textBox = (message) => { return `\`${message}\``; };

const embedCreator = (title, desc, pre=configData.botInfo.displayName, color=0x1623cc, thumb = process.env.T404_LogoLink) => {
    return new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
        .setAuthor({ name: pre })
        .setDescription(desc)
        .setThumbnail(thumb)
        .setTimestamp()
        .setFooter({ text: `By ${configData.botInfo.displayName}`, iconURL: thumb });
};

/**
 * 
 * @param {0|1|2} accessLevel 
 * @param {*} userRoles 
 * @returns {boolean}
 */
const verifyAccessLevel = (accessLevel, userRoles) => {
    const roleLevelsMap = {
        0: configData.roleLevels.level0,
        1: configData.roleLevels.level1,
        2: configData.roleLevels.level2
    };

    return roleLevelsMap[accessLevel].some(roleId => userRoles.has(roleId));

};

const isOwner = (userID) => {
    return configData.ownerInfo.some(v => userID == v.id);

};

const guildInfo = configData.guildInfo
const ownerInfo = configData.ownerInfo;
const roleLevels = configData.roleLevels;
let ownerNick = [];
ownerInfo.forEach(v => ownerNick.push(v.name));

export {textBox, embedCreator, verifyAccessLevel, isOwner, guildInfo, ownerInfo, roleLevels, ownerNick, configData}