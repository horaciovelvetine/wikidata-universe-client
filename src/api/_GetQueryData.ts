import axios from "axios";
import { API_URL } from "./_ApiUrl";
import { RequestResponse } from "../interfaces";
import { calcSafeDimensions } from "../p5/functions";

export async function getQueryData(query: string): Promise<RequestResponse> {
  const safeDimensions = calcSafeDimensions();
  const strDimensions = `${safeDimensions.width}x${safeDimensions.height}`;
  return await axios.get(API_URL('query-data'), { params: { query, dimensions: strDimensions } })
    .then(res => {
      return { status: res.status, data: res.data };
    })
    .catch(err => {
      if (err.code === 'ERR_NETWORK') {
        return { status: 500, data: 'The WikiData Universe API is currently offline. Try again later.' };
      }
      return { status: 404, data: 'Unknown Error Encountered.' };
    });
}