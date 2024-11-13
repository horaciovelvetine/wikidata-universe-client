import axios from "axios";
import { apiURL, RequestPayload, RequestResponse } from "../";

export async function postClickTargetData(payload: RequestPayload): Promise<RequestResponse> {
  return await axios.post(apiURL('click-target'), payload)
    .then(res => {
      console.log("postClickTargetData()", res.data)
      return { status: res.status, data: res.data };
    });
}