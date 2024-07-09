import axios from 'axios';
import { LocalAPI } from './util/UrlBuilders';

export interface get_status_response {
  status?: string;
}

export async function getAPIStatusRequest(): Promise<get_status_response> {
  return await axios
    .get(LocalAPI("status"))
    .then((response) => {
      console.log("API Status Response: ", response.data.status);
      return response.data;
    }).catch(error => {
      console.error("API Status Error: ", error);
      return { status: "API Currently Unavailable. Please try again later." }
    })

}