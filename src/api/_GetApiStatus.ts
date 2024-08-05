import axios from 'axios';
import { buildApiUrl } from '../functions';
import { IApiStatus } from '../interfaces';

export async function getApiStatusRequest(): Promise<IApiStatus> {
  return await axios
    .get(buildApiUrl("status"))
    .then((response) => {
      return { status: response.status, message: response.data };
    }).catch(error => {
      if (error.code === "ERR_NETWORK") {
        return { message: "The WikiData Universe API is currently offline. Try again later.", status: 500 };
      }
      debugger;
      return { message: "Unknown Error Encountered.", status: 404 };
    });
}