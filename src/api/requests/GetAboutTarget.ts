import axios from "axios";
import { RequestResponse, apiURL } from "..";

export async function getAboutTarget(target: String): Promise<RequestResponse> {
  return await axios.get(apiURL('about'), { params: { target } })
    .then(res => {
      console.log(`getAboutTarget(${target} : target)`, res)
      return { status: res.status, data: res.data };
    });
}