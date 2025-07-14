import 'dotenv/config';
import { 
    Client,
    Events,
    GatewayIntentBits,
    Partials,

} from 'discord.js';
import { existsSync, mkdirSync } from 'fs';
import {
    embedCreator,
    guildInfo,
    isOwner,
    ownerInfo,
    ownerNick,
    roleLevels,
    textBox,
    verifyAccessLevel 
} from './utils.js';
import { loadCommands, loadEvents, loadInteractions } from './loader.js';

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

botClient.once(Events.ClientReady, readyClient => {
    console.log(`[?] Logged as ${readyClient.user.tag}`);
    if (!existsSync('./logs')) mkdirSync('./logs');

});

let ctx = {
    botPrefix: "t?",
    log: true,
    botClient,
    guildInfo,
    ownerInfo,
    ownerNick,
    roleLevels,
    textBox,
    embedCreator,
    isOwner,
    verifyAccessLevel,
    interactions: await loadInteractions(),
    commands: await loadCommands()

};

await loadEvents(botClient, ctx);

process.on('unhandledRejection', (reason, promise) => {
    console.error('[UnhandledRejection]', reason);
});
process.on('uncaughtException', (err) => {
    console.error('[UncaughtException]', err);
});
botClient.login(botToken);
