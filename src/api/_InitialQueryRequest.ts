import axios from 'axios';
import { buildApiUrl } from '../functions';

export interface IInitialQueryParams {
  query: string;
}

export interface IInitialQueryResponse {
  data: {
    graphset: any;
    originalQuery: string;
    graphSize: any;
  }
}

export async function getInitialQueryRequest({ query }: IInitialQueryParams): Promise<IInitialQueryResponse> {
  return await axios
    .get(buildApiUrl("v1/initial-query"), {
      params: {
        query: query
      }
    })
    .then((response) => {
      return response.data;
    }).catch(error => {
      console.error(error);
      throw new Error("Unable to get API Status Response, API may be offline.")
    })
}