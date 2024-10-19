import { RequestPayload } from "./RequestPayload";

export interface RequestResponse {
  status: number;
  errMsg: string | undefined;
  data: RequestPayload;
}