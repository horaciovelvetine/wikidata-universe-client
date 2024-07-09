import axios from 'axios';
import { LocalAPI } from '../util/UrlBuilders';

interface initial_query_params {
  query: string;
}

interface initial_query_response {
  status?: string;
}

export async function getStatusRequest({ query }: initial_query_params): Promise<initial_query_response> {
  return await axios
    .get(LocalAPI("v1/initial-query"), {
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