import axios from "axios";
import { apiURL, RequestPayload, RequestResponse } from "../";

export async function postRelatedDataQueue(payload: RequestPayload): Promise<RequestResponse> {
  return await axios.post(apiURL('refresh-layout'), payload)
    .then(res => {
      console.log("postRelatedDataQueue()", res.data)
      return { status: res.status, data: res.data };
    });
}