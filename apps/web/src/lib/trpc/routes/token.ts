import { t } from "$lib/trpc/t";

import { z } from "zod";

import { SOL } from "@helius-labs/xray-proton";

import type { UITokenMetadata } from "$lib/types";

const { HELIUS_KEY, HELIUS_API_URL } = process.env;

import { tokens } from "@helius-labs/xray-test";

export const token = t.procedure
    .input(z.array(z.string()))
    .query(async ({ input }) => {
        if (!HELIUS_KEY) {
            const mocked = tokens.find(
                ({ mint, account }) => mint === input[0] || account === input[0]
            );

            return mocked;
        }

        if (input[0] === SOL) {
            const metadata: UITokenMetadata = {
                address: "",
                attributes: [],
                collectionKey: "",
                creators: [],
                description: "",
                image: "",
                name: "",
            };

            metadata.name = "SOL";
            metadata.image = "/media/tokens/solana.png";
            metadata.address = SOL;
            console.log("SOL token", metadata);
            return { isSOL: true, metadata: metadata };
        } else {
            //check if token is normal NFT or compressed NFT
            const url = `https://rpc.helius.xyz/?api-key=${HELIUS_KEY}`;

            const response = await fetch(url, {
                body: JSON.stringify({
                    id: "asset",
                    jsonrpc: "2.0",
                    method: "getAsset",
                    params: [input],
                }),
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
            });

            const data = await response.json();

            if (data?.result?.compression?.compressed === true) {
                const assetData = await fetch(data.result.content.json_uri);
                const returnAssetData = await assetData.json();

                const metadata: UITokenMetadata = {
                    address: "",
                    attributes: [],
                    collectionKey: "",
                    creators: [],
                    description: "",
                    image: "",
                    name: "",
                };

                metadata.address = data?.result?.id || "";
                metadata.attributes = returnAssetData?.attributes || [];
                metadata.collectionKey =
                    data?.result?.grouping[0]?.group_value || "";
                metadata.creators = data?.result?.creators || [];
                metadata.description = returnAssetData?.description || "";
                metadata.image = returnAssetData?.image || "";
                metadata.name = returnAssetData?.name || "";

                console.log("compressed token", metadata);

                return { isCompressed: true, metadata: metadata };
            } else {
                //get normal token metadata
                const response = await fetch(
                    `${HELIUS_API_URL}/v0/token-metadata/?api-key=${HELIUS_KEY}`,
                    {
                        body: JSON.stringify({
                            includeOffChain: true,
                            mintAccounts: input,
                        }),
                        method: "POST",
                    }
                );

                const json = await response.json();

                const data = json?.length ? json[0] : {};

                console.log("data", data);

                const metadata: UITokenMetadata = {
                    address: "",
                    attributes: [],
                    collectionKey: "",
                    creators: [],
                    description: "",
                    image: "",
                    name: "",
                };

                metadata.address = data?.account;
                metadata.attributes =
                    data?.offChainMetadata?.metadata?.attributes;
                metadata.creators =
                    data?.onChainMetadata?.metadata?.data?.creators;
                metadata.description =
                    data?.offChainMetadata?.metadata?.description;
                metadata.collectionKey =
                    data?.onChainMetadata?.metadata?.collection?.key;
                metadata.image =
                    data?.offChainMetadata?.metadata?.image ||
                    data?.onChainMetadata?.metadata?.data.image ||
                    data?.legacyMetadata?.logoURI;
                metadata.name =
                    data?.offChainMetadata?.metadata?.name ||
                    data?.legacyMetadata?.name ||
                    data?.onChainMetadata?.metadata?.data.name;

                console.log("regular token", metadata);
                return { isNFT: true, metadata: metadata };
            }
        }
    });
