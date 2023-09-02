{{
	const tokenSymbol = Symbol.for("@n4jm/token")
	
	function _token(kind, data) {
    	return {
        	[tokenSymbol]: kind,
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
        TAG: (id, data) => _token("tag", { id, data }),
        IMPORT: (path) => _token("import", { path }),
        ABSTRACT_LABEL: (id, properties, extending = undefined) => _token("abstract-label", { id, properties, extending }),
        LABEL: (id, properties, relationships, extending = undefined) => _token("label", { id, properties, relationships, extending }),
        PROPERTY: (id, ref, tags) => _token("property", { id, ref, tags }),
        RELATIONSHIP: (id, direction, refs, tags) => _token("relationship", { id, direction, refs, tags }),
        ENUM: (id, members) => _token("enum", { id, members }),
        LABEL_REF: (id) => _token("label-ref", { id }),
        TYPE_REF: (id) => _token("type-ref", { id })
    };
}}

start = imports:(@importList eol)? declarations:(labelDecl / enumDecl)|.., eol| eol? {
	return { imports, declarations }
}

// utils
word "word" = $[a-z0-9_]i+
id "identifier" = $[a-z_]i+
_ "whitespace" = [ \t]* { return undefined }
eol "end of line" = _ [\n\t ]+ { return undefined }
path "file path" = $([a-z0-9_-]+)|1.., "/"|
strLiteral "string literal" = '"' inner:$[^"]* '"' { return inner }
data "data" = word / strLiteral
tag "property tag" = "@" id:id data:("(" @data|.., listDelim| ")")? { return Token.TAG(id, data) }
listDelim = _ "," _

/*
import file
import path/to/my-file
*/
importList "import statement list" = importStmt|1.., eol|
importStmt "import statement" = "import" _ path:importPath { return Token.IMPORT(path) }
importPath "import path" = path

labelDecl = abstr:("abstract" _)? meta:labelDeclHeader _ "{" eol data:labelDeclBody eol "}" _ {
    const isAbstract = !!abstr;
    
    const id = meta.id;
    const extending = meta.extending;

    const properties = [];
    const relationships = [];

    for (const attr of data.attrs) {
        if (kind(attr) === "property") {
            properties.push(attr);
        } else {
            relationships.push(attr);
        }
    }

    return isAbstract
        ? Token.ABSTRACT_LABEL(id, properties, extending ? Token.LABEL_REF(extending) : undefined)
        : Token.LABEL(id, properties, relationships, extending ? Token.LABEL_REF(extending) : undefined);
}
labelDeclHeader = id:id extending:(_ ":" _ @id)? { return { id, extending } }
labelDeclBody = _ attrs:(prop / rel)|.., eol| { return { attrs } }

enumDecl = "enum" _ id:id _ "{" eol data:enumDeclBody eol "}" _ {
    return Token.ENUM(id, data)
}
enumDeclBody = _ data:data|.., eol| { return data }

prop "property" =
    id:id _ ":" _ typeRef:id _ tags:tag|.., _| {
        return Token.PROPERTY(id, Token.TYPE_REF(typeRef), tags)
    }
rel "relationship" =
    id:id _ direction:$("->" / "<-" / "<>" / "--") _ "[" _ refs:id|1.., listDelim| _ "]" _ tags:tag|.., _| {
        return Token.RELATIONSHIP(id, direction, refs.map(Token.LABEL_REF), tags)
    }
