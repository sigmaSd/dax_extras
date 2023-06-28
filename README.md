# About

A useful util library for writing shell script stream processing using
[dsherret/dax](https://github.com/dsherret/dax).

## Quick example

```typescript
import $ from "https://raw.githubusercontent.com/impactaky/dax_extras/1.0.0/mod.ts";

const commands = await $`echo "abc\nabcde\nabcdef\nbcdefg"`
  .map((l) => `bug : ${l}`)
  .$(`grep 'bug : a'`).noThrow()
  .filter((l) => l.length > "bug : ".length + 3)
  .xargs((l) => $`echo de${l}`);

await Promise.all(commands);
// => debug : abcde
// => debug : abcdef
```

## Usage

### Use with your dax extends

You can import dax_extras like this.

```typescript
import $ from "https://deno.land/x/dax@0.32.0/mod.ts";
import "https://raw.githubusercontent.com/impactaky/dax_extras/1.0.0/mod.ts";
```
