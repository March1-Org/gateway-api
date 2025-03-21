import type { JwtType } from "utils/types/jwt";
import { error } from "elysia";

type Options = {
  request: Request;
  jwt: JwtType;
};

export async function checkAuthorization({ request, jwt }: Options) {
  const authorization = request.headers.get("authorization");
  if (!authorization) {
    return error("Unauthorized");
  }
  const authorized = await jwt.verify(authorization);
  if (!authorized) {
    return error("Unauthorized");
  }
}
