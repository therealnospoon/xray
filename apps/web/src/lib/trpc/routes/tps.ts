import randomBetween from "$lib/util/random-between";

import { solana } from "@helius-labs/xray-util";

import { t } from "$lib/trpc/t";

const { HELIUS_KEY } = process.env;

export const tps = t.procedure.query(async () => {
    if (!HELIUS_KEY) {
        return randomBetween(1000, 7000);
    }

    return solana.getCurrentTPS(HELIUS_KEY);
});
