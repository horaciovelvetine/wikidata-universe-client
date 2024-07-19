import axios from 'axios';
import { buildApiUrl } from '../functions';

export interface IApiStatusResponse {
  message: string;
  status: number;
}

export async function getApiStatusRequest(): Promise<IApiStatusResponse> {
  return await axios
    .get(buildApiUrl("status"))
    .then((response) => {
      console.log("getApiStatusRequest()::", response);
      return {
        status: response.status,
        message: response.data.message
      };
    }).catch(error => {
      console.log("Error getApiStatusRequest():", error.message)
      return { status: 500, message: "API Unavailable." }
    });
}