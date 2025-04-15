import { dlopen, FFIType, suffix } from 'bun:ffi';
import { error, t } from 'elysia';
const { i32 } = FFIType;

export const addBody = t.Object({
  a: t.Integer(),
  b: t.Integer(),
});

type AddBody = typeof addBody.static;

type Options = {
  body: AddBody;
};

export async function add({ body: { a, b } }: Options) {
  try {
    const path = `./zig/zig-out/bin/add.${suffix}`;

    const lib = dlopen(path, {
      add: {
        args: [i32, i32],
        returns: i32,
      },
    });

    return lib.symbols.add(a, b);
  } catch (e) {
    console.log(e);
    return error(500, 'Failed to perform native code');
  }
}
