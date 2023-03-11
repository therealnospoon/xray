import { z } from "zod";

import { t } from "$lib/trpc/t";

import { solanaConnect } from "@helius-labs/xray-util";

import { xraySearch } from "@helius-labs/xray-search";

import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

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

export const accountInfo = t.procedure
    .input(z.string())
    .output(
        z.object({
            address: z.string(),
            isAccount: z.boolean(),
            isDomain: z.boolean(),
            isToken: z.boolean(),
            isTransaction: z.boolean(),
            multi: z.array(z.string()).optional(),
            search: z.string(),
            url: z.string(),
            valid: z.boolean(),
        })
    )
    .query(async ({ input: address }) => {
        const connection = solanaConnect();

        const pubKey = new PublicKey(address);

        const accountInfo = await connection.getParsedAccountInfo(pubKey);

        return {
            ...accountInfo,
            balance: (accountInfo?.value?.lamports || 0) / LAMPORTS_PER_SOL,
        };
    });
