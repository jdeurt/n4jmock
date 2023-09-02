import type { AbstractLabelToken } from "./tokens/abstract-label.js";
import type { EnumToken } from "./tokens/enum.js";
import type { ImportToken } from "./tokens/import.js";
import type { LabelToken } from "./tokens/label.js";

export interface Result {
    imports: ImportToken[] | null;
    declarations: (AbstractLabelToken | EnumToken | LabelToken)[];
}
