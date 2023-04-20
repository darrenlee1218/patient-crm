import { Response } from "express";

export interface UResponse<T = unknown> {
  status: "OK" | "ERROR";
  data: T;
  error: string | null;
}

export const uResponse = <T>(
  res: Response,
  data: T,
  status: number = 200,
  error: string = ""
) => {
  const responseData: UResponse<T> = {
    status: status >= 400 ? "ERROR" : "OK",
    data,
    error,
  };

  return res.status(status).json(responseData);
};
