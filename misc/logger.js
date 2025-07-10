import fs from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';

async function log(rawContent, userId, userName) {
    const timestamp = new Date().toISOString();

    if (!existsSync('./logs')) mkdirSync('./logs');
    const content = `[UTC ${timestamp}] ${rawContent.replaceAll('\n', '')}\n`;
    const contentAll = `[UTC ${timestamp}] [${userName} (${userId})] ${rawContent.replaceAll('\n', '')}\n`;
    await fs.appendFile(`./logs/${userId}.log`, content);
    await fs.appendFile(`./logs/server.log`, contentAll);

};

export {log}