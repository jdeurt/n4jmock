import type { PropertyToken } from "../../structs/tokens/property.js";

export const getTag = (id: string) => (from: PropertyToken) =>
    from.tags.find((t) => t.id === id);
