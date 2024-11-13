import { RequestPayload } from "./RequestPayload";

export interface RequestResponse {
  status: number;
  data: RequestPayload;
}