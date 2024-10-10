import axios from "axios";
import { API_URL } from "./_ApiUrl";
import { RequestPayload, RequestResponse } from "../interfaces";

export async function postRelatedDataQueue(payload: RequestPayload): Promise<RequestResponse> {
  return await axios.post(API_URL('fetch-related'), payload)
    .then(res => {
      return { status: res.status, data: res.data, errMsg: undefined };
    })
    .catch(err => {
      console.log(err);
      debugger;
      if (err.code === 'ERR_NETWORK') {
        return { status: 400, errMsg: 'The WikiData Universe API is currently offline.Try again later.', data: {} } as RequestResponse;
      }
      return { status: 404, errMsg: 'Unknown Error Encountered.', data: {} } as RequestResponse;
    });
}