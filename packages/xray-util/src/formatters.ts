export const cap = (string: string = "") =>
    string
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

export const formatDate = (timestamp: number) => {
    if (!timestamp) {
        return "";
    }

    const date =
        String(timestamp).length < 13
            ? new Date(timestamp * 1000)
            : new Date(timestamp);

    const dateString = `${date.getMonth() + 1}/${date.getDate()}/${String(
        date.getFullYear()
    ).slice(-2)}`;

    const timeString = date.toLocaleTimeString();

    return `${timeString.slice(0, timeString.length - 6)} ${timeString.slice(
        -2
    )} ${dateString}`;
};

export const formatMoney = (price: number = 0) =>
    price.toLocaleString("en-US", {
        currency: "USD",
        style: "currency",
    });

interface ParsedDateTime {
    clockHours: number;
    day: number;
    hours: number;
    minutes: number;
    month: string;
    seconds: number;
    suffix: string;
    year: number;
    formatted: string;
}

const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

export const prettyDate = (timestamp: number): ParsedDateTime => {
    const date = new Date(timestamp * 1000);

    const hours = date.getHours();

    const clockHours = ((hours + 11) % 12) + 1;

    const result: ParsedDateTime = {
        clockHours,
        day: date.getDate(),
        formatted: "",
        hours: date.getHours(),
        minutes: date.getMinutes(),
        month: months[date.getMonth()],
        seconds: date.getSeconds(),
        suffix: hours >= 12 ? "pm" : "am",
        year: date.getFullYear(),
    };

    result.formatted = `${clockHours}:${result.minutes < 10 ? "0" : ""}${
        result.minutes
    } ${result.suffix} ${result.month} ${result.day} '${String(
        result.year
    ).slice(-2)}`;

    return result;
};

export const shortenString = (address: string = "", size = 5): string =>
    `${address.slice(0, size)}...${address.slice(-size)}`;
