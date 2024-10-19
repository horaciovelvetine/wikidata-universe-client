import axios from "axios";
import { apiURL, RequestPayload, RequestResponse } from "../";

export async function postRelatedDataQueue(payload: RequestPayload): Promise<RequestResponse> {
  return await axios.post(apiURL('fetch-related'), payload)
    .then(res => {
      console.log("postRelatedDataQueue()", res)
      return { status: res.status, data: res.data, errMsg: undefined };
    })
    .catch(err => {
      debugger;
      if (err.code === 'ERR_NETWORK') {
        return { status: 400, errMsg: 'The WikiData Universe API is currently offline.Try again later.', data: {} } as RequestResponse;
      }
      return { status: 404, errMsg: 'Unknown Error Encountered.', data: {} } as RequestResponse;
    });
}