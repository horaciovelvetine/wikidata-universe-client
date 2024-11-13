import axios from "axios";
import { RequestResponse, apiURL } from "..";

export async function getTutorialSlideData(target: string): Promise<RequestResponse> {
  return await axios.get(apiURL('tutorial'), { params: { target } })
    .then(res => {
      console.log(`getTutorialSlideData(${target})`, res)
      return { status: res.status, data: res.data };
    });
}