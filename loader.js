import { readdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function loadCommands() {
    const files = readdirSync(path.join(__dirname, 'commands')).filter(f => f.endsWith('.js'));
    const commands = new Map();
    for (const file of files) {
        const cmd = (await import(`./commands/${file}`)).default;
        commands.set(cmd.name, cmd);
    }
    return commands;
}

export async function loadEvents(botClient, ctx) {
    const files = readdirSync(path.join(__dirname, 'events')).filter(f => f.endsWith('.js'));
    for (const file of files) {
        const event = (await import(`./events/${file}`)).default;
        if (event.once) {
            botClient.once(event.name, (...args) => event.execute(...args, ctx));
        } else {
            botClient.on(event.name, (...args) => event.execute(...args, ctx));
        }
    }
}

export async function loadInteractions() {
    const files = readdirSync(path.join(__dirname, 'interactions')).filter(f => f.endsWith('.js'));
    const interactions = new Map();
    for (const file of files) {
        const interaction = (await import(`./interactions/${file}`)).default;
        interactions.set(interaction.customId, interaction);
    }
    return interactions;
}
