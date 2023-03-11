import { json, type RequestEvent } from "@sveltejs/kit";

import { solanaConnect } from "@helius-labs/xray-util";

import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

export async function GET({ params }: RequestEvent) {
    const connection = solanaConnect();

    const pubKey = new PublicKey(params.address || "");

    const accountInfo = await connection.getParsedAccountInfo(pubKey);

    return json({
        data: {
            ...accountInfo,
            balance: (accountInfo?.value?.lamports || 0) / LAMPORTS_PER_SOL,
        },
    });
}
