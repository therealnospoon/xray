import {
    type PublicKey as PublicKeyType,
    PublicKey,
    Connection,
    LAMPORTS_PER_SOL,
} from "@solana/web3.js";

// pricefromlamports
export const priceFromLamports = (lamports: number): number =>
    lamports / LAMPORTS_PER_SOL;

// resolveBackpackUsername
export const resolveBackpackUsername = async (username: string) => {
    const url = `https://backpack-api.xnfts.dev/users/primarySolPubkey/${username}`;

    const response = await fetch(url);

    const { publicKey = "" } = await response.json();

    console.log("THIS IS THE PUB KEY", publicKey);

    return publicKey;
};

// resolveBonfidaDomain

// resolveAnsDomain

// connect
export const connect = (
    network: string = "https://api.mainnet-beta.solana.com"
) => new Connection(network, "confirmed");

// validate public key
/**
 * Retrieves a list of all webhooks associated with the current API key
 *
 * @param {string} address - A string of a public key
 * @returns {PublicKeyType} A public key string
 */
export const validatePubkey = (address: string = ""): PublicKeyType | null => {
    try {
        return new PublicKey(address);
    } catch (error) {
        return null;
    }
};

// get current tps
/**
 * @param {string} key - A string of Helius API key
 * @returns {number} A promise that resolves to a number of current TPS
 */
export const getCurrentTPS = async (key: string): Promise<number> => {
    try {
        const rpcClient: Connection = new Connection(
            `https://rpc.helius.xyz/?api-key=${key}`
        );
        const samples = await rpcClient.getRecentPerformanceSamples(1);
        return samples[0]?.numTransactions / samples[0]?.samplePeriodSecs;
    } catch (e) {
        throw new Error(`error calling getCurrentTPS: ${e}`);
    }
};

// get current price
/**
 * @param {string} token - A string of a Token symbol
 * @returns {number} A promise that resolves to a number of current price of
 *   token that was passed in
 */
export const getCurrentPrice = async (token: string): Promise<number> => {
    try {
        const response = await fetch(
            `https://public-api.birdeye.so/public/price/?address=${token}`
        );

        const json = await response.json();

        return json.data.value;
    } catch (e) {
        throw new Error(`error calling getCurrentPrice: ${e}`);
    }
};

// accountInfo
export const getAccountInfo = async (address: string) => {
    const connection = connect();

    const pubKey = new PublicKey(address);

    const accountInfo = await connection.getParsedAccountInfo(pubKey);

    return {
        ...accountInfo,
        balance: priceFromLamports(accountInfo?.value?.lamports || 0),
    };
};
