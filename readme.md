# n4jmock

A DSL for mocking N4J data.

## Usage

```dart
abstract Animal {
    name: string
}

Dog : Animal {
    breed: string

    chases -> [Cat]
}

Cat : Animal {
    breed: string

    chases -> [Mouse]
}

Mouse : Animal {}
```

Outputs

```
CREATE (Dog_0:Dog)
SET Dog_0.breed = 'zwF7nJGoVB'
SET Dog_0.name = 'DcxTvgQvMa'
CREATE (Cat_0:Cat)
SET Cat_0.breed = '5uhcLigR8u'
SET Cat_0.name = 'W5E16sunLe'
CREATE (Mouse_0:Mouse)
SET Mouse_0.name = 'u6HfY7dr79'
MATCH (Dog_1:Dog), (Cat_1:Cat)
CREATE (Dog_1)-[:chases]->(Cat_1)
MATCH (Cat_2:Cat), (Mouse_1:Mouse)
CREATE (Cat_2)-[:chases]->(Mouse_1)
```
