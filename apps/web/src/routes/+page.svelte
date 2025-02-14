<style>
    .intro {
        min-height: 65vh;
    }

    .transition-section {
        border-radius: 100%;
    }
</style>

<script lang="ts">
    import { onMount } from "svelte";

    import { fly } from "svelte/transition";

    import Icon from "$lib/components/icon.svelte";
    import Search from "$lib/components/search.svelte";
    import IntersectionObserver from "svelte-intersection-observer";

    import { browser } from "$app/environment";
    // @ts-ignore
    import { LottiePlayer } from "@lottiefiles/svelte-lottie-player";

    let searchError = "";

    let exploreELement: HTMLElement;
    let heliusElement: HTMLElement;

    let isFocused = false;

    let clearSearch = () => null;
    let focusInput = () => null;

    onMount(() => {
        setTimeout(() => {
            focusInput();
        }, 100);
    });
</script>

<div class="intro relative flex h-screen w-full items-center">
    <div
        style="background-image: url(/media/gradient.png);"
        class="absolute top-1/2 left-1/2 h-full w-full -translate-y-1/2 -translate-x-1/2 bg-cover bg-center"
    />

    <div class="mx-auto w-full max-w-2xl md:-translate-y-1/4">
        <div class="mb-10">
            <h1 class="text-center text-9xl font-bold opacity-80">XRAY</h1>
        </div>

        <div class="relative w-full px-3">
            <Search
                size="lg"
                {searchError}
                bind:focusInput
                bind:clearSearch
                on:focusin={() => (isFocused = true)}
                on:focusout={() => (isFocused = false)}
            />
        </div>
    </div>
</div>

<IntersectionObserver
    once={true}
    rootMargin="100px"
    element={exploreELement}
    let:intersecting
>
    <section
        bind:this={exploreELement}
        class="transition-section relative z-10 mx-auto overflow-hidden bg-black py-24"
    >
        {#if intersecting}
            <div
                class="relative mx-auto max-w-2xl text-center"
                in:fly={{
                    duration: 750,
                    y: 100,
                }}
            >
                <h1 class="my-4 text-6xl font-bold">
                    <span
                        class="bg-gradient-to-br from-orange-700 to-yellow-400 bg-clip-text text-transparent"
                    >
                        Explore
                    </span>
                    the Solana Blockchain
                </h1>
            </div>
        {/if}
    </section>
    <section class="px- mx-auto mb-20 max-w-6xl py-10">
        <div class="mx-auto grid grid-cols-1 gap-10 px-5 md:grid-cols-3">
            <div>
                <div class="rounded-lg">
                    <div
                        class="mb-5 flex h-12 w-12 items-center justify-center rounded-full border"
                    >
                        <Icon
                            id="lightning"
                            size="lg"
                        />
                    </div>

                    <div>
                        <h1 class="text-xl font-bold">Explorer</h1>
                        <p class="opacity-50">
                            We categorize and parse transaction data to provide
                            an interface that intuitively groups transaction
                            history by type.
                        </p>
                    </div>
                </div>
            </div>
            <div>
                <div class="rounded-lg">
                    <div
                        class="mb-5 flex h-12 w-12 items-center justify-center rounded-full border"
                    >
                        <Icon
                            id="sale"
                            size="lg"
                        />
                    </div>

                    <div>
                        <h1 class="text-xl font-bold">NFT Buy/Sell History</h1>
                        <p class="opacity-50">
                            View the NFTs and tokens held by a specified account
                            or the transaction history of a particular token.
                            This lets you do things like see all of the bids,
                            sales, listings on a certain NFT.
                        </p>
                    </div>
                </div>
            </div>
            <div>
                <div class="rounded-lg">
                    <div
                        class="mb-5 flex h-12 w-12 items-center justify-center rounded-full border"
                    >
                        <h1>.sol</h1>
                    </div>

                    <div>
                        <h1 class="text-xl font-bold">Lookup by Domain</h1>
                        <p class="opacity-50">
                            Not only can you lookup any account, token or
                            transaction, you can also search .sol, .abc, .poor,
                            and .bonk domains.
                        </p>
                    </div>
                </div>
            </div>
            <div>
                <div class="rounded-lg">
                    <div
                        class="mb-5 flex h-12 w-12 items-center justify-center rounded-full border"
                    >
                        <h1>🎒</h1>
                    </div>

                    <div>
                        <h1 class="text-xl font-bold">xNFT Backpack Support</h1>
                        <p class="opacity-50">
                            You can Lookup Backpack usernames by searching
                            "@yourname", like "@xray".
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</IntersectionObserver>

<IntersectionObserver
    once={true}
    rootMargin="10%"
    element={heliusElement}
    let:intersecting
>
    <section
        bind:this={heliusElement}
        class="mx-auto max-w-5xl py-10 px-3"
    >
        {#if intersecting}
            <div
                in:fly={{
                    duration: 750,
                    y: 100,
                }}
                class="mx-auto max-w-5xl"
            >
                <div class="overflow-hidden pb-32">
                    <div class="mt-10 scale-150 md:mt-0">
                        {#if browser}
                            <LottiePlayer
                                src="/media/animation.json"
                                autoplay={true}
                                loop={true}
                                controls={false}
                                renderer="svg"
                                background="transparent"
                                height="300%"
                                width="300%"
                            />
                        {/if}
                    </div>
                </div>

                <div>
                    <h1 class="scale-100 text-6xl font-bold text-current">
                        Powered by

                        <span
                            class="bg-gradient-to-br from-orange-700 to-yellow-400 bg-clip-text text-transparent"
                        >
                            Helius
                        </span>
                    </h1>
                    <div class="mt-5 grid grid-cols-12 gap-4">
                        <div class="col-span-2 flex items-center md:col-span-1">
                            <div
                                class="flex h-6 w-6 items-center justify-center rounded-full bg-white"
                            >
                                <Icon
                                    id="check"
                                    fill="black"
                                />
                            </div>
                        </div>
                        <div class="col-span-10 md:col-span-11">
                            <p class="opacity-50">
                                We provide the most powerful Solana RPC hardware
                                around. We offer the fastest speeds at the
                                lowest prices possible. We also provide private
                                RPCs for serious users.
                            </p>
                        </div>
                        <div class="col-span-2 flex items-center md:col-span-1">
                            <div
                                class="flex h-6 w-6 items-center justify-center rounded-full bg-white"
                            >
                                <Icon
                                    id="check"
                                    fill="black"
                                />
                            </div>
                        </div>
                        <div class="col-span-10 md:col-span-11">
                            <p class="opacity-50">
                                Quickly build bots, analytics, marketplaces,
                                portfolio or wallet trackers using the most
                                complete Solana NFT API.
                            </p>
                        </div>
                        <div class="col-span-2 flex items-center md:col-span-1">
                            <div
                                class="flex h-6 w-6 items-center justify-center rounded-full bg-white"
                            >
                                <Icon
                                    id="check"
                                    fill="black"
                                />
                            </div>
                        </div>
                        <div class="col-span-10 md:col-span-11">
                            <p class="opacity-50">
                                We allow you to query historical data by
                                multiple dimensions including transaction types
                                (DAO votes, NFT Mints, DeFi Swaps, etc) or
                                underlying protocols (Jupiter, Magic Eden, etc).
                            </p>
                        </div>
                        <div class="col-span-2 flex items-center md:col-span-1">
                            <div
                                class="flex h-6 w-6 items-center justify-center rounded-full bg-white"
                            >
                                <Icon
                                    id="check"
                                    fill="black"
                                />
                            </div>
                        </div>
                        <div class="col-span-10 md:col-span-11">
                            <p class="opacity-50">
                                Stream on-chain events on up to 100k addresses
                                for free.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <a
                href="https://helius.xyz"
                class="btn-primary btn mt-8 text-black"
                target="_blank"
                rel="noreferrer"
            >
                <span>Get Started</span>
            </a>
        {/if}
    </section>
</IntersectionObserver>
