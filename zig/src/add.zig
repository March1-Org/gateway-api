const std = @import("std");
const expect = std.testing.expect;

export fn add(a: i32, b: i32) i32 {
    return a + b;
}

test "1 + 2 = 3" {
    const sum = add(1, 2);

    try expect(sum == 3);
}
