import { solanaConnect } from "@helius-labs/xray-util";

import { solanaValidatePubkey } from "@helius-labs/xray-util";

import { getDomainKey, NameRegistryState } from "@bonfida/spl-name-service";

import { PublicKey } from "@solana/web3.js";

import { TldParser } from "@onsol/tldparser";

export interface SearchResult {
    url: string;
    address: string;
    isToken: boolean;
    isAccount: boolean;
    isTransaction: boolean;
    isDomain: boolean;
    valid: boolean;
    search: string;
    multi?: Array<string>;
}

export const xraySearch = async (params) => {
    const search = params?.search as string;

    const connection = solanaConnect();
    const ans = new TldParser(connection);

    // If it's long, assume it's a tx.
    // They will present with an error on the tx page if it's not.
    const probablyTransactionSignature = search.length > 50;
    const probablySolanaName = search.length > 4 && search.slice(-4) === ".sol";
    const isDomain = search.length > 4 && search.includes(".");

    const probablyBackpackName = search.startsWith("@") && search.length > 1;

    if (solanaValidatePubkey(search)) {
        const pubkey = new PublicKey(search);
        const account = await connection.getParsedAccountInfo(pubkey);

        // TODO Property 'program' does not exist on type 'Buffer | ParsedAccountData'.
        // @ts-ignore
        const isToken = account?.value?.data?.program === "spl-token";

        const data: SearchResult = {
            address: params.search || "",
            isAccount: false,
            isDomain: false,
            isToken,
            isTransaction: false,
            search: params.search || "",
            url: isToken
                ? `/${params.search}/token`
                : `/${params.search}/wallet`,
            valid: true,
        };

        return json({ data });
    } else if (probablyTransactionSignature) {
        const data: SearchResult = {
            address: params.search || "",
            isAccount: false,
            isDomain: false,
            isToken: false,
            isTransaction: true,
            search: params.search || "",
            url: `/${params?.search}/tx`,
            valid: true,
        };

        return json({ data });
    } else if (probablySolanaName) {
        try {
            const { pubkey } = await getDomainKey(search);

            const domain = await NameRegistryState.retrieve(connection, pubkey);

            const data: SearchResult = {
                address: domain?.registry?.owner.toBase58() || "",
                isAccount: false,
                isDomain: false,
                isToken: false,
                isTransaction: true,
                search: params.search || "",
                url: `/${domain?.registry?.owner.toBase58()}/wallet`,
                valid: true,
            };

            return json({ data });
        } catch (error) {
            return json({
                data: {
                    url: `/`,
                    valid: false,
                },
            });
        }
    } else if (probablyBackpackName) {
        const username = search.slice(1);

        const url = `https://backpack-api.xnfts.dev/users/primarySolPubkey/${username}`;

        const response = await fetch(url);

        const { publicKey = "" } = await response.json();

        if (!publicKey) {
            return json({
                data: {
                    url: `/`,
                    valid: false,
                },
            });
        }

        const data: SearchResult = {
            address: params.search || "",
            isAccount: false,
            isDomain: false,
            isToken: false,
            isTransaction: true,
            search: params.search || "",
            url: `/${publicKey}/wallet`,
            valid: true,
        };

        return json({ data });
    } else if (isDomain) {
        const owner = await ans.getOwnerFromDomainTld(search);

        if (!owner) {
            return {
                url: `/`,
                valid: false,
            };
        }

        return {
            url: `/${owner}`,
            valid: true,
        };
    }

    return {
        url: `/`,
        valid: false,
    };
};
