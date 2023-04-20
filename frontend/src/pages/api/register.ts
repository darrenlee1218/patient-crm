import type { NextApiRequest, NextApiResponse } from "next";
import { PostBody } from "@config/constant";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let errMsg = "";
  try {
    const resp = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}user/register`, {
      method: "POST",
      headers: PostBody,
      body: JSON.stringify(req.body),
    });

    const respBody = await resp.json();
    if (respBody.status == "ERROR") {
      errMsg = respBody.error;
    }
  } catch (err: any) {
    errMsg = "Network error";
  }

  return res.json({ errMsg });
}
