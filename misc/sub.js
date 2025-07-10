import fs from 'fs';
import dns from 'dns';
import pLimit from 'p-limit';

const resolver = new dns.promises.Resolver();

const globalSleep = 275;
const longSleep = 1155 + globalSleep

function sleep(ms) {
    const variance = 1500;
    return new Promise(resolve => setTimeout(resolve, (ms + Math.floor(Math.random() * variance))));

};

async function superFetch(url, options) {
    const retries = 2;
    const timeout = longSleep;
    const backoff = globalSleep;

    for (let attempt = 1; attempt <= retries; attempt++) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);

        try {
            const res = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(id);
            if (!res.ok) {
                throw new Error(`HTTP(S) ${res.status}`);

            };

            return res;
        } catch (error) {
            if (attempt == retries) {
                console.log('FAILED')

            };

            await sleep(backoff * attempt);

        };
    };
};

/**
 * Tenta resolver um subdomínio e retorna detalhes do registro.
 * @param {string} fqdn - Subdomínio FQDN (ex: api.site.com)
 * @returns {Promise<object|null>}
 */
async function resolveSubdomain(fqdn) {
    function normalizeAddresses(data) {
        if (!Array.isArray(data)) return [];
        return data.flat().map(entry => {
            if (typeof entry === 'string') return entry;
            if (typeof entry === 'object') return JSON.stringify(entry);
            return String(entry);
        });
    }

    try {
        const any = await resolver.resolveAny(fqdn);
        return {
            subdomain: fqdn,
            type: 'ANY',
            addresses: normalizeAddresses(any)
        }
    } catch { }

    try {
        // Tenta resolver A record (IPv4)
        const aRecords = await resolver.resolve4(fqdn);
        return {
            subdomain: fqdn,
            type: 'A',
            addresses: aRecords
        };
    } catch { }

    try {
        // Tenta resolver AAAA record (IPv6)
        const aaaaRecords = await resolver.resolve6(fqdn);
        return {
            subdomain: fqdn,
            type: 'AAAA',
            addresses: aaaaRecords
        };
    } catch { }

    try {
        // Tenta resolver CNAME
        const cname = await resolver.resolveCname(fqdn);
        return {
            subdomain: fqdn,
            type: 'CNAME',
            addresses: cname
        };
    } catch { }

    try {
        const mx = await resolver.resolveMx(fqdn);
        return {
            subdomain: fqdn,
            type: 'MX',
            addresses: normalizeAddresses(mx)
        }
    } catch { }

    try {
        const ns = await resolver.resolveNs(fqdn)
        return {
            subdomain: fqdn,
            type: 'NS',
            addresses: ns
        }
    } catch { }

    try {
        const txt = await resolver.resolveTxt(fqdn)
        return {
            subdomain: fqdn,
            type: 'TXT',
            addresses: normalizeAddresses(txt)
        }
    } catch { }

    return {
        subdomain: fqdn,
        type: 'UNKNOWN (Not Resolved)',
        addresses: null
    };
}

/**
 * Faz brute force de subdomínios com resultado detalhado.
 * @param {string} domain - Domínio alvo
 * @param {object} options - Configurações opcionais
 * @param {number} options.concurrency - Paralelismo máximo
 * @returns {Promise<object[]>} Subdomínios válidos encontrados
 */
export async function findSubdomains(domain, mode, m, options = {}) {
    const {
        concurrency = 300
    } = options;

    const wordlistList = {
        low: './wordlists/subs/low.txt',
        mid: './wordlists/subs/mid.txt',
        high: './wordlists/subs/high.txt',
        test: './wordlists/subs/test.txt'
    };
    const wordlist = fs.readFileSync(String(wordlistList[mode]), 'utf-8')
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);

    const limit = pLimit(concurrency);

    console.log('Starting Tasks definition');
    const tasks = wordlist.map(sub => limit(async () => {
        const fqdn = `${sub}.${domain}`;
        const resolved = await resolveSubdomain(fqdn);
        if (!resolved || !resolved.addresses) return null;

        return resolved;

    }));

    console.log('Starting Promise.all');
    const results = await Promise.all(tasks);
    
    const onlyResolved = results.filter(r =>
        r && r.addresses && (
            r.type === 'A' || r.type === 'AAAA' || r.type === 'ANY'
        )
    );

    console.log('Starting HTTP tryReach task definition');
    const httpCheckTasks = onlyResolved.map(sub => limit(async () => {
        let tryReachFQDN = await superFetch(`http://${sub.subdomain}`, { method: 'HEAD' });

        if (!tryReachFQDN?.ok) {
            tryReachFQDN = await superFetch(`https://${sub.subdomain}`, { method: 'HEAD' });

        };

        sub.httpStatus = tryReachFQDN?.status || null;
        sub.httpReachable = tryReachFQDN?.ok || false;

        return sub;

    }));

    console.log('Starting HTTP tryReach Promise.all');
    const finalResults = await Promise.all(httpCheckTasks);

    return finalResults;

};
