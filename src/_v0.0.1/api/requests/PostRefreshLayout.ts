import axios from "axios";
import { apiURL, RequestPayload, RequestResponse } from "..";

export async function postRefreshLayout(payload: RequestPayload): Promise<RequestResponse> {
  return await axios.post(apiURL('refresh-layout'), payload)
    .then(res => {
      console.log("postRefreshLayout()", res.data)
      return { status: res.status, data: res.data };
    });
}