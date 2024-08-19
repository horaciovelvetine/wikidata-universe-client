import { RequestResponse } from "../../interfaces";

export function queryIsSuccess(res: RequestResponse): boolean {
  return res.status === 200;
}