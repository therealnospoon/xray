import { randomBetween } from "@helius-labs/xray-util";

import { Helius } from "helius-sdk";

import { t } from "$lib/trpc/t";

const { HELIUS_KEY } = process.env;

export const tps = t.procedure.query(async () => {
    if (!HELIUS_KEY) {
        return randomBetween(1000, 7000);
    }

    const heliusAPI = new Helius(HELIUS_KEY || "");

    const tps = await heliusAPI.getCurrentTPS();

    return tps;
});
