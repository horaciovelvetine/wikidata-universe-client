import axios from "axios";
import { API_URL } from "./_ApiUrl";
import { RequestPayload, RequestResponse } from "../interfaces";

import DemoRelatedQueueResponse from '../assets/data/r-hammond-demo-query-r1-2.json'

export async function postRelatedDataQueue(payload: RequestPayload): Promise<RequestResponse> {
  return await axios.post(API_URL('related-data-queue'), payload)
    .then(res => {
      return { status: res.status, data: res.data, errMsg: undefined };
    })
    .catch(err => {
      console.log(err);
      if (err.code === 'ERR_NETWORK') {
        return { status: 200, errMsg: 'API OFFLINE DEMO SERVED', data: DemoRelatedQueueResponse};
      }
      return { status: 404, errMsg: 'Unknown Error Encountered.', data: {} } as RequestResponse;
    });
}