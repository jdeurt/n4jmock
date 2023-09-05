{{
	const tokenSymbol = Symbol.for("@n4jm/token")
	
	function _token(kind, data, location) {
    	return {
        	[tokenSymbol]: kind,
            location,
            ...data
        }
    }

    function kind(token) {
        return token[tokenSymbol];
    }

    const Direction = {
        OUT: "->",
        IN: "<-",
        BOTH: "<>",
        UNDIRECTED: "--"
    };

    const Token = {
        TAG: (id, data, location) => _token("tag", { id, data }, location),
        LABEL: (id, properties, relationships, location, abstract = false, extending = undefined) => _token("label", { id, properties, relationships, abstract, extending }, location),
        PROPERTY: (id, ref, tags, location) => _token("property", { id, ref, tags }, location),
        RELATIONSHIP: (id, direction, refs, tags, location) => _token("relationship", { id, direction, refs, tags }, location),
        ENUM: (id, members, location) => _token("enum", { id, members }, location),
        LABEL_REF: (id, location) => _token("label-ref", { id }, location),
        TYPE_REF: (id, isList, location) => _token("type-ref", { id, isList }, location),
        DATA: (content, type, location) => _token("data", { content, type }, location),
        ID: (name, location) => _token("id", { name }, location)
    };
}}

start = declarations:(labelDecl / enumDecl)|.., eol| eol? {
	return { declarations }
}

// utils
word "word" = $[a-z0-9_]i+
numLiteral "number literal" = $([0-9]+ ("." [0-9]+)?)
id "identifier" = name:$([a-z_]i [a-z0-9_]i*) { return Token.ID(name, location()) }
_ "whitespace" = [ \t]*
eol "end of line" = (comment? [\n\t ])+
strLiteral "string literal" = '"' inner:$[^"]* '"' { return inner }
tag "property tag" = "@" id:$id data:("(" @data|.., listDelim| ")")? { return Token.TAG(id, data ?? [], location()) }
listDelim = _ "," _

labelDecl "label declaration" = abstr:("abstract" _)? meta:labelDeclHeader _ data:("{" eol @labelDeclBody eol "}" / "{" _ "}") _ {
    const isAbstract = !!abstr;
    
    const id = meta.id;
    const extending = meta.extending;

    const properties = [];
    const relationships = [];

    for (const attr of data?.attrs ?? []) {
        if (kind(attr) === "property") {
            properties.push(attr);
        } else {
            relationships.push(attr);
        }
    }

    return Token.LABEL(id, properties, relationships, location(), isAbstract, extending ? extending : undefined);
}
labelDeclHeader "label declaration header" = id:id extending:(_ ":" _ @labelRef)? { return { id, extending } }
labelDeclBody "label declaration body" = _ attrs:(prop / rel)|.., eol| { return { attrs } }

enumDecl "enum declaration" = "enum" _ id:id _ "{" eol data:enumDeclBody eol "}" _ {
    return Token.ENUM(id, data, location())
}
enumDeclBody "enum declaraion body" = _ data:data|.., eol| { return data }

prop "property" =
    id:$id _ ":" _ typeRef:typeRef _ tags:tag|.., _| {
        return Token.PROPERTY(id, typeRef, tags, location())
    }
rel "relationship" =
    id:$id _ direction:$("->" / "<-" / "<>" / "--") _ "[" _ labelRefs:labelRef|1.., listDelim| _ "]" _ tags:tag|.., _| {
        return Token.RELATIONSHIP(id, direction, labelRefs, tags, location())
    }

labelRef "label" = id:$id { return Token.LABEL_REF(id, location()) }
typeRef "type" = id:$id isList:"[]"? { return Token.TYPE_REF(id, !!isList, location()) }

data "data" = strContent:(word / strLiteral) / numContent:numLiteral {
    if (!!strContent) {
        return Token.DATA(strContent, String, location())
    }

    return Token.DATA(numContent, Number, location())
}

comment = _ "//" [^\n]*
