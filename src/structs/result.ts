import type { EnumToken } from "./tokens/enum.js";
import type { LabelToken } from "./tokens/label.js";

export interface Result {
    declarations: (EnumToken | LabelToken)[];
}
