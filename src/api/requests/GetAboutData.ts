import axios from "axios";
import { RequestResponse, apiURL } from "..";

export async function getAboutData(): Promise<RequestResponse> {
  return await axios.get(apiURL('about-details'))
    .then(res => {
      console.log("getAboutData()", res)
      return { status: res.status, data: res.data };
    });
}