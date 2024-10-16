import axios from "axios";
import { RequestResponse } from "../interfaces";
import { API_URL } from "./_ApiUrl";

export async function getApiStatus(): Promise<RequestResponse> {
  return await axios
    .get(API_URL("status"))
    .then((res) => {
      console.log("getApiStatus()", res)
      return { status: res.status, data: res.data, errMsg: undefined };
    }).catch(err => {
      if (err.code === "ERR_NETWORK") {
        return { errMsg: "The WikiData Universe API is currently offline. Try again later.", status: 500, data: {} } as RequestResponse;
      }
      return { errMsg: "Unknown Error Encountered.", status: 404, data: {} } as RequestResponse;
    });
}