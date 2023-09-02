import { faker } from "@faker-js/faker";
import { KnownType } from "../constants/known-type.js";
import type { EnumToken } from "../structs/tokens/enum.js";
import type { PropertyToken } from "../structs/tokens/property.js";
import { KnownTag } from "../constants/known-tag.js";
import { randomUUID } from "node:crypto";
import { random } from "./random.js";

export const mockBool = (prop: PropertyToken) => {
    if (KnownTag.true(prop)) {
        return true;
    }

    if (KnownTag.false(prop)) {
        return false;
    }

    return [true, false][Math.floor(Math.random() * 2)];
};

export const mockFloat = (prop: PropertyToken) => {
    const min = KnownTag.min(prop)?.data[0] ?? 0;
    const max = KnownTag.max(prop)?.data[0] ?? 1;

    return faker.number.float({
        min: Number(min),
        max: Number(max),
    });
};

export const mockInt = (prop: PropertyToken) => {
    if (KnownTag.date(prop)) {
        return Date.now();
    }

    const min = KnownTag.min(prop)?.data[0] ?? 0;
    const max = KnownTag.max(prop)?.data[0] ?? Number.MAX_SAFE_INTEGER;

    return faker.number.int({
        min: Number(min),
        max: Number(max),
    });
};

// eslint-disable-next-line sonarjs/cognitive-complexity
export const mockString = (prop: PropertyToken) => {
    const alphaTag = KnownTag.alpha(prop);
    const numericTag = KnownTag.numeric(prop);
    const alphanumericTag = KnownTag.alphanumeric(prop);
    const binaryTag = KnownTag.binary(prop);
    const uuidTag = KnownTag.uuid(prop);

    if (alphaTag) {
        const lengthOrMin = alphaTag.data[0];
        const max = alphaTag.data[1];

        if (max) {
            return faker.string.alpha({
                length: { min: Number(lengthOrMin), max: Number(max) },
            });
        }

        if (lengthOrMin) {
            return faker.string.alpha({
                length: Number(lengthOrMin),
            });
        }
    }

    if (numericTag) {
        const lengthOrMin = numericTag.data[0];
        const max = numericTag.data[1];

        if (max) {
            return faker.string.numeric({
                length: { min: Number(lengthOrMin), max: Number(max) },
            });
        }

        if (lengthOrMin) {
            return faker.string.numeric({
                length: Number(lengthOrMin),
            });
        }
    }

    if (alphanumericTag) {
        const lengthOrMin = alphanumericTag.data[0];
        const max = alphanumericTag.data[1];

        if (max) {
            return faker.string.alphanumeric({
                length: { min: Number(lengthOrMin), max: Number(max) },
            });
        }

        if (lengthOrMin) {
            return faker.string.alphanumeric({
                length: Number(lengthOrMin),
            });
        }
    }

    if (binaryTag) {
        const lengthOrMin = binaryTag.data[0];
        const max = binaryTag.data[1];

        if (max) {
            return faker.string.binary({
                length: { min: Number(lengthOrMin), max: Number(max) },
            });
        }

        if (lengthOrMin) {
            return faker.string.binary({
                length: Number(lengthOrMin),
            });
        }
    }

    if (uuidTag) {
        return randomUUID();
    }

    return faker.string.alphanumeric(10);
};

export const mockType = (type: KnownType | EnumToken, prop: PropertyToken) => {
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
            return random(type.members);
        }
    }
};