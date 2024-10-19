import axios from "axios";
import { apiURL, RequestResponse } from "../";

export async function getApiStatus(): Promise<RequestResponse> {
  return await axios
    .get(apiURL("status"))
    .then((res) => {
      console.log("getApiStatus()", res.data)
      return { status: res.status, data: res.data, errMsg: undefined };
    });
}