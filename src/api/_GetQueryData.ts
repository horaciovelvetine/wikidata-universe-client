import axios from "axios";
import { API_URL } from "./_ApiUrl";
import { RequestResponse, SessionData } from "../interfaces";

export async function getQueryData(query: string): Promise<RequestResponse> {
  return await axios.get(API_URL('query-data'), { params: { query } })
    .then(res => {
      return { status: res.status, data: res.data };
    })
    .catch(err => {
      if (err.code === 'ERR_NETWORK') {
        return { status: 500, data: 'The WikiData Universe API is currently offline. Try again later.' as unknown as SessionData };
      }
      return { status: 404, data: 'Unknown Error Encountered.' as unknown as SessionData };
    });
}