import axios from "axios";
import { API_URL } from "./_ApiUrl";
import { RequestResponse, SessionData } from "../interfaces";

export async function postRelatedDataClick(payload: SessionData): Promise<RequestResponse> {

  return await axios.post(API_URL('related-data-click'), payload)
    .then(res => {
      return { status: res.status, data: res.data };
    })
    .catch(err => {
      console.log(err);
      if (err.code === 'ERR_NETWORK') {
        return { status: 500, data: 'The WikiData Universe API is currently offline. Try again later.' };
      }
      return { status: 404, data: 'Unknown Error Encountered.' };
    });
}