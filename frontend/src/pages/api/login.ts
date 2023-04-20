import type { NextApiRequest, NextApiResponse } from "next";
import { PostBody, UserRole, UserAccess } from "@config/constant";
import { serializeCookie } from "@lib";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let errMsg = "";
  let userInfo = {};
  try {
    const resp = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}user/login`, {
      method: "POST",
      headers: PostBody,
      body: JSON.stringify(req.body),
    });

    const respBody = await resp.json();
    if (respBody.status == "ERROR") {
      errMsg = respBody.error;
    } else {
      const { data } = respBody;
      const accessArr = data.access;
      userInfo = {
        username: data.user.username,
        usermail: data.user.usermail,
        isAdmin: data.user.role == UserRole.ADMIN,
        id: data.user.id,
        token: data.tokens.access.token,
        access: {
          [UserAccess.CREATE]: accessArr.indexOf(UserAccess.CREATE) >= 0,
          [UserAccess.READ]: accessArr.indexOf(UserAccess.READ) >= 0,
          [UserAccess.UPDATE]: accessArr.indexOf(UserAccess.UPDATE) >= 0,
          [UserAccess.DELETE]: accessArr.indexOf(UserAccess.DELETE) >= 0,
        },
      };

      const cookie = serializeCookie("auth", { login: true }, { path: "/" });
      res.setHeader("Set-Cookie", cookie);
    }
  } catch (err: any) {
    errMsg = "Network error";
  }

  return res.json({ errMsg, userInfo });
}
