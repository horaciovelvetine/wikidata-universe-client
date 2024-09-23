import axios from "axios";
import { API_URL } from "./_ApiUrl";
import { RequestResponse } from "../interfaces";

import DemoRelatedQueueResponse from '../assets/data/r-hammond-demo-query-r1-2.json'

export async function getQueryData(query: string): Promise<RequestResponse> {
  return await axios.get(API_URL('query-data'), { params: { query } })
    .then(res => {
      return { status: res.status, data: res.data, errMsg: undefined };
    })
    .catch(err => {
      if (err.code === 'ERR_NETWORK') {
        return { status: 400, data: {}, errMsg: 'The WikiData Universe API is currently offline. Try again later.' } as RequestResponse;
      }
      debugger
      return { status: 404, data: { query }, errMsg: 'Unknown Error Encountered.' } as RequestResponse;
    });
}