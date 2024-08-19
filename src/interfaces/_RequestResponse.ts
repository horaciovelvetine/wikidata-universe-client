import { SessionData } from "./_SessionData";

export interface RequestResponse {
  status: number;
  data: SessionData | string;
}