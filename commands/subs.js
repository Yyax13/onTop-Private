import { z } from 'zod';
import { findSubdomains } from '../misc/sub.js';

export default {
    name: 'subs',
    access: 'public',
    description: 'Run an subdomain brute-force finding',
    execute: async (m, mArgs, ctx) => {
        const { textBox, botPrefix, embedCreator } = ctx;

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
            return await m.author.send({ embeds: [totalResultEmbed] });
        
        } catch (err) {
            return await m.reply('Can\'t send messages to you, because your private messages option is set to deny messages if sender is not your friend');

        }
    }
};