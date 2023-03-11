import type { RequestEvent } from "@sveltejs/kit";

const search = (str) => {
    console.log(str);
};

export async function GET({ params }: RequestEvent) {
    return "Old search endpoint";
}
