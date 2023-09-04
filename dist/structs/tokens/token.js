export var TokenKind;
(function (TokenKind) {
    TokenKind["TAG"] = "tag";
    TokenKind["LABEL"] = "label";
    TokenKind["PROPERTY"] = "property";
    TokenKind["RELATIONSHIP"] = "relationship";
    TokenKind["ENUM"] = "enum";
    TokenKind["LABEL_REF"] = "label-ref";
    TokenKind["TYPE_REF"] = "type-ref";
    TokenKind["DATA"] = "data";
    TokenKind["ID"] = "id";
})(TokenKind || (TokenKind = {}));
