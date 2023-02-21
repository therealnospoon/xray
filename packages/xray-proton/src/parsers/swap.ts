import { getSolanaName } from "@helius-labs/helius-namor";

import { LAMPORTS_PER_SOL } from "@solana/web3.js";

import type { EnrichedTransaction, Source, TokenTransfer } from "helius-sdk";

import { ProtonTransaction, ProtonTransactionAction } from "../types";

interface TempTokenTransfer extends TokenTransfer {
    tokenAmount: number;
}

export const parseSwap = (
    transaction: EnrichedTransaction,
    address: string | undefined
): ProtonTransaction => {
    const type = "SWAP";
    let source = "SYSTEM_PROGRAM" as Source;

    if (transaction?.tokenTransfers === null) {
        return {
            actions: [],
            fee: 0,
            primaryUser: "",
            signature: "",
            source,
            timestamp: 0,
            type,
        };
    }

    const { tokenTransfers } = transaction;
    const actions: ProtonTransactionAction[] = [];
    const primaryUser = tokenTransfers[0].fromUserAccount || "";

    const { signature, timestamp } = transaction;
    const fee = transaction.fee / LAMPORTS_PER_SOL;

    source = transaction.source;

    for (let i = 0; i < tokenTransfers.length; i++) {
        const tx = tokenTransfers[i] as TempTokenTransfer;

        const from = tx.fromUserAccount || "";
        let fromName;

        if (tx.fromUserAccount) {
            fromName = getSolanaName(tx.fromUserAccount);
        }

        const to = tx.toUserAccount || "";
        let toName;

        if (tx.toUserAccount) {
            toName = getSolanaName(tx.toUserAccount);
        }

        const amount = tx.tokenAmount;

        if (!address) {
            const actionType = "SWAP";
            if (tx.fromUserAccount === primaryUser) {
                const sent = tx.mint;
                actions.push({
                    actionType,
                    amount,
                    from,
                    fromName,
                    sent,
                    to,
                    toName,
                });
            } else if (tx.toUserAccount === primaryUser) {
                const received = tx.mint;
                actions.push({
                    actionType,
                    amount,
                    from,
                    fromName,
                    received,
                    to,
                    toName,
                });
            }
        } else {
            const actionType =
                tx.fromUserAccount === primaryUser
                    ? "SWAP_SENT"
                    : "SWAP_RECEIVED";

            if (actionType === "SWAP_SENT") {
                const sent = tx.mint;
                actions.push({
                    actionType,
                    amount,
                    from,
                    fromName,
                    sent,
                    to,
                    toName,
                });
            } else if (actionType === "SWAP_RECEIVED") {
                const received = tx.mint;
                actions.push({
                    actionType,
                    amount,
                    from,
                    fromName,
                    received,
                    to,
                    toName,
                });
            }
        }
    }

    return {
        actions,
        fee,
        primaryUser,
        signature,
        source,
        timestamp,
        type,
    };
};
