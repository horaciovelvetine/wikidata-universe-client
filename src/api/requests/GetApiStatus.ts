import axios from "axios";
import { apiURL, RequestResponse } from "../";

export async function getApiStatus(): Promise<RequestResponse> {
  return await axios
    .get(apiURL("status"))
    .then((res) => {
      console.log("getApiStatus()", res)
      return { status: res.status, data: res.data, errMsg: undefined };
    }).catch(err => {
      if (err.code === "ERR_NETWORK") {
        return { status: 500, data: {} } as RequestResponse;
      }
      return { status: 404, data: {} } as RequestResponse;
    });
}