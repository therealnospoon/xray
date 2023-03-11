import { z } from "zod";

import { t } from "$lib/trpc/t";

import { solanaConnect } from "@helius-labs/xray-util";

import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

export const rawTransaction = t.procedure
    .input(z.string())
    .query(async ({ input }) => {
        const connection = solanaConnect();

        const transaction = await connection.getTransaction(input, {
            maxSupportedTransactionVersion: 0,
        });

        return {
            transaction,
        };
    });
