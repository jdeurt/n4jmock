# n4jmock

A DSL for mocking N4J data.

## Usage

```dart
enum E {
    A
    B
    C
}

abstract A {
    a: int
    b: string
}

B : A {
    c: int @max(3)
    d: E
}

C {
    has_b -> [B]
}
```

Outputs

```
CREATE (a:B)
SET a.c = 2
SET a.d = 'B'
SET a.a = 8565248579600384
SET a.b = 'ktLqhqRSbU'
CREATE (a:C)
MATCH (a:C), (b:B)
CREATE (a)-[:has_b]->(b)
```
