import { RequestPayload } from "./_RequestPayload";

export interface RequestResponse {
  status: number;
  errMsg: string | undefined;
  data: RequestPayload;
}