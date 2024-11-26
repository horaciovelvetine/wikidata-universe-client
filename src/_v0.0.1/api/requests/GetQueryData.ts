import axios from "axios";
import { RequestResponse, apiURL } from "..";

export async function getQueryData(query: string): Promise<RequestResponse> {
  return await axios.get(apiURL('query-data'), { params: { query } })
    .then(res => {
      console.log(`getQueryData(${query} : query )`, res.data)
      return { status: res.status, data: res.data };
    });
}