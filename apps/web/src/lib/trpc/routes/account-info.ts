import { z } from "zod";

import { t } from "$lib/trpc/t";

import { solana } from "@helius-labs/xray-util";

const { HELIUS_KEY } = process.env;

export const accountInfo = t.procedure
    .input(z.string())
    .query(async ({ input: address }) => {
        if (!HELIUS_KEY) {
            return {
                balance: 690420000,
            };
        }

        return await solana.getAccountInfo(address);
    });
