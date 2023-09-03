import { getTag } from "../utils/tag.js";

export const KnownTag = {
    true: getTag("true"),
    false: getTag("false"),
    min: getTag("min"),
    max: getTag("max"),
    date: getTag("date"),
    numeric: getTag("num"),
    alpha: getTag("alpha"),
    alphanumeric: getTag("alphanumeric"),
    binary: getTag("binary"),
    uuid: getTag("uuid"),
} as const;
