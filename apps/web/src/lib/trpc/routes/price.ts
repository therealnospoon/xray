import { z } from "zod";

import { t } from "$lib/trpc/t";

const { HELIUS_KEY } = process.env;

import { solana } from "@helius-labs/xray-util";

export const price = t.procedure
    .input(z.string())
    .query(async ({ input: token }) => {
        if (!HELIUS_KEY) {
            return 25;
        }

        return solana.getCurrentPrice(token);
    });
