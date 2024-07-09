import axios from 'axios';
import { buildApiUrl } from '../functions';

export interface IGetAPIStatusResponse {
  status?: string;
}

export async function getApiStatusRequest(): Promise<IGetAPIStatusResponse> {
  return await axios
    .get(buildApiUrl("status"))
    .then((response) => {
      console.log("API Status Response: ", response.data.status);
      return response.data;
    }).catch(error => {
      console.error("API Status Error: ", error);
      return { status: "API Currently Unavailable. Please try again later." }
    })

}