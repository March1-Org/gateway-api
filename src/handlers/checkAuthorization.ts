import type { JwtType } from "@/utils/types/jwt";
import { error } from "elysia";

type Options = {
  request: Request;
  templateJwt: JwtType;
};

export async function checkAuthorization({ request, templateJwt }: Options) {
  const authorization = request.headers.get("authorization");
  if (!authorization) {
    return error("Unauthorized");
  }
  const authorized = await templateJwt.verify(authorization);
  if (!authorized) {
    return error("Unauthorized");
  }
}
