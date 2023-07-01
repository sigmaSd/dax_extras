import $ from "../mod.ts";
import { assertEquals } from "../test_deps.ts";

Deno.test("LineStream.text", async () => {
  const text = await $`echo "line1\nline2"`
    .lineStream().text();
  assertEquals(text, "line1\nline2\n");
});

Deno.test("LineStram.lines", async () => {
  const lines = await $`echo "line1\nline2"`
    .lineStream().lines();
  assertEquals(lines, ["line1", "line2"]);
});

Deno.test("LineStream.$", async () => {
  const text = await $`echo "line1\nline2"`
    .lineStream()
    .$(`cat`)
    .lines();
  assertEquals(text, ["line1", "line2"]);
});

Deno.test("LineStream.pipe", async () => {
  const text = await $`echo "line1\nline2"`
    .lineStream()
    .pipe($`cat`)
    .lines();
  assertEquals(text, ["line1", "line2"]);
});

Deno.test("LineStream.map", async () => {
  const text = await $`echo "line1\nline2"`
    .lineStream()
    .map((l) => {
      return `prefix:${l}`;
    })
    .lines();
  assertEquals(text, ["prefix:line1", "prefix:line2"]);
});

Deno.test("LineStream.filter", async () => {
  const text = await $`echo "333\n4444"`
    .lineStream()
    .filter((l) => {
      return l.length >= 4;
    })
    .lines();
  assertEquals(text, ["4444"]);
});

Deno.test("LineStream.xargs one-line", async () => {
  const result = await $`echo hello`
    .lineStream()
    .xargs((input) => $`echo ${input} world`)
    .then((output) => output[0].xargs((input) => $`echo ${input} world2`));
  assertEquals(await result[0].text(), "hello world world2");
});

Deno.test("LineStream.xargs multi-line", async () => {
  const result = await $`echo "line1\nline2"`
    .lineStream()
    .xargs((input) => $`echo ${input} world`);
  assertEquals(await result[0].text(), "line1 world");
  assertEquals(await result[1].text(), "line2 world");
});

Deno.test("LineStream.apply return string", async () => {
  const result = await $`echo "prefix: val1\nprefix: val2\nprefix:\tval2"`
    .lineStream()
    .apply((l) => {
      const val = l.split(/\s+/)[1];
      if (val == "val2") {
        return `result ${val}`;
      }
    })
    .lines();
  assertEquals(result.length, 2);
  assertEquals(result[0], "result val2");
  assertEquals(result[1], "result val2");
});

Deno.test("LineStream.apply return string[]", async () => {
  const result = await $`echo "prefix: val1\nprefix: val2"`
    .lineStream()
    .apply((l) => {
      const val = l.split(/\s+/)[1];
      if (val == "val2") {
        return [`result1 ${val}`, `result2 ${val}`];
      }
    })
    .lines();
  assertEquals(result.length, 2);
  assertEquals(result[0], "result1 val2");
  assertEquals(result[1], "result2 val2");
});
