import { faker } from "@faker-js/faker";
import { KnownType } from "../../constants/known-type.js";
import { KnownTag } from "./known-tag.js";
import { randomUUID } from "node:crypto";
import { random } from "../../utils/random.js";
export const mockBool = (prop) => {
    if (KnownTag.true(prop)) {
        return true;
    }
    if (KnownTag.false(prop)) {
        return false;
    }
    return [true, false][Math.floor(Math.random() * 2)];
};
export const mockFloat = (prop) => {
    const min = KnownTag.min(prop)?.data[0]?.content ?? 0;
    const max = KnownTag.max(prop)?.data[0]?.content ?? 1;
    return faker.number.float({
        min: Number(min),
        max: Number(max),
    });
};
export const mockInt = (prop) => {
    if (KnownTag.date(prop)) {
        return Date.now();
    }
    const min = KnownTag.min(prop)?.data[0]?.content ?? 0;
    const max = KnownTag.max(prop)?.data[0]?.content ?? Number.MAX_SAFE_INTEGER;
    return faker.number.int({
        min: Number(min),
        max: Number(max),
    });
};
// eslint-disable-next-line sonarjs/cognitive-complexity
export const mockString = (prop) => {
    const alphaTag = KnownTag.alpha(prop);
    const numericTag = KnownTag.numeric(prop);
    const alphanumericTag = KnownTag.alphanumeric(prop);
    const binaryTag = KnownTag.binary(prop);
    const uuidTag = KnownTag.uuid(prop);
    if (alphaTag) {
        const lengthOrMin = alphaTag.data[0]?.content;
        const max = alphaTag.data[1]?.content;
        if (max) {
            return faker.string.alpha({
                length: { min: Number(lengthOrMin), max: Number(max) },
            });
        }
        return faker.string.alpha({
            length: Number(lengthOrMin || 10),
        });
    }
    if (numericTag) {
        const lengthOrMin = numericTag.data[0]?.content;
        const max = numericTag.data[1]?.content;
        if (max) {
            return faker.string.numeric({
                length: { min: Number(lengthOrMin), max: Number(max) },
            });
        }
        return faker.string.numeric({
            length: Number(lengthOrMin || 10),
        });
    }
    if (alphanumericTag) {
        const lengthOrMin = alphanumericTag.data[0]?.content;
        const max = alphanumericTag.data[1]?.content;
        if (max) {
            return faker.string.alphanumeric({
                length: { min: Number(lengthOrMin), max: Number(max) },
            });
        }
        return faker.string.alphanumeric({
            length: Number(lengthOrMin || 10),
        });
    }
    if (binaryTag) {
        const lengthOrMin = binaryTag.data[0]?.content;
        const max = binaryTag.data[1]?.content;
        if (max) {
            return faker.string.binary({
                length: { min: Number(lengthOrMin), max: Number(max) },
            });
        }
        return faker.string.binary({
            length: Number(lengthOrMin || 10),
        });
    }
    if (uuidTag) {
        return randomUUID();
    }
    return faker.string.alphanumeric(10);
};
export const mock = (type, prop) => {
    switch (type) {
        case KnownType.BOOL: {
            return mockBool(prop);
        }
        case KnownType.FLOAT: {
            return mockFloat(prop);
        }
        case KnownType.INT: {
            return mockInt(prop);
        }
        case KnownType.STRING: {
            return mockString(prop);
        }
        default: {
            return random(type.members).content;
        }
    }
};
