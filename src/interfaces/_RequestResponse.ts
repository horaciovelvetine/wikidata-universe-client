import { SessionData } from "./_SessionData";

export interface RequestResponse {
  status: number;
  message: string;
  data: SessionData;
}