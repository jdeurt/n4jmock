# n4jmock

A DSL for mocking N4J data.

Language support for VSCode is available here: https://github.com/jdeurt/n4jm-language-support.

## Usage

`$ n4jm ./test -o=./test.cypher`

```dart
// Abstract labels do not get their own node
// but are inherited by their children
abstract Animal {
    id: string @uuid
    name: string
    beepBoop: string @binary
}
```

```dart
// Cat inherits all properties and relationships
// of Animal
Cat : Animal {
    breed: string

    chases -> [Mouse]
}
```

```dart
Dog : Animal {
    breed: string

    // A relationship can target more than one label
    chases -> [Cat, Mouse]
}
```

```dart
// Enums define a collection of values from which
// the transpiler can randomly pick from
enum MouseFood {
    cheese
}

enum UnusedForTheSakeOfExample {
    Hello // Inferred as "Hello"
    "World" // A string literl
    42.0 // A floating point literal
    42 // An integer literal
}

Mouse : Animal {
    eats: MouseFood
}
```

Outputs

```
CREATE (mouse_0:Mouse:Animal)
SET mouse_0.eats = 'cheese'
SET mouse_0.id = 'a2223187-0508-4e02-aca7-075416b6b383'
SET mouse_0.name = 'yPUWoZOChN'
SET mouse_0.beepBoop = '0b1001101010'
CREATE (dog_0:Dog:Animal)
SET dog_0.breed = 'd3geXC1xWL'
SET dog_0.id = 'e9d68de7-709e-4ac1-afa5-b983c2b69f95'
SET dog_0.name = '8wMPyIHvye'
SET dog_0.beepBoop = '0b0100111000'
CREATE (cat_0:Cat:Animal)
SET cat_0.breed = '4EspCAGAOh'
SET cat_0.id = '54712a62-1b03-4f05-85c8-2f4f04d9ee85'
SET cat_0.name = 'bseutnlRBX'
SET cat_0.beepBoop = '0b1100100101'
MATCH (dog_1:Dog), (cat_1:Cat)
CREATE (dog_1)-[:chases]->(cat_1)
MATCH (dog_2:Dog), (mouse_1:Mouse)
CREATE (dog_2)-[:chases]->(mouse_1)
MATCH (cat_2:Cat), (mouse_2:Mouse)
CREATE (cat_2)-[:chases]->(mouse_2)
```
