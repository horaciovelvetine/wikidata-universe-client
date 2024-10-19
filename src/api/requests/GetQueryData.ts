import axios from "axios";
import { RequestResponse, apiURL } from "..";

export async function getQueryData(query: string): Promise<RequestResponse> {
  return await axios.get(apiURL('query-data'), { params: { query } })
    .then(res => {
      console.log("getQueryData()", res)
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