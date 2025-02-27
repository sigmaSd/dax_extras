# About

A useful util library for writing shell script stream processing using
[dsherret/dax](https://github.com/dsherret/dax).

## Quick example

```typescript
import $ from "https://deno.land/x/dax@0.32.0/mod.ts";
// the dax version used internally by dax extras is at the suffix
// it **must** match the dax version used
import "https://deno.land/x/dax_extras@2.2.0-0.32.0/mod.ts";

const lines = await $`echo "olleh\nnop\ndlrow\nnop\nnop"` // => ["olleh", "nop", "dlrow", "nop", "nop"]
  .$(`grep -v dummy`).noThrow() // => ["olleh", "nop", "dlrow", "nop", "nop"]
  .apply((l) => {
    if (l != "nop") {
      return l.split("").reverse().join("");
    }
  }) // => ["hello", "world"]
  .xargs((l) => $`echo ${l}!`) // => ["hello!", "world!"]
  .lines();
console.log(lines);
```

## Usage

Please see [tests](LineStream/LineStream.test.ts).
