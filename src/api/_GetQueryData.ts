import axios from "axios";
import { API_URL } from "./_ApiUrl";
import { RequestResponse, SessionData } from "../interfaces";

interface GetQueryParams {
  query: string;
}

export async function getQueryData({ query }: GetQueryParams): Promise<RequestResponse> {
  return await axios.get(API_URL('get-query-data'), { params: { query } })
    .then(res => {
      return { status: res.status, message: res.statusText, data: res.data };
    })
    .catch(err => {
      if (err.code === 'ERR_NETWORK') {
        return { status: 500, message: 'The WikiData Universe API is currently offline. Try again later.', data: {} as SessionData };
      }
      return { status: 404, message: 'Unknown Error Encountered.', data: {} as SessionData };
    });
}