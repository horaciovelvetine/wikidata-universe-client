import axios from "axios";
import { ApiStatus } from "../interfaces";
import { API_URL } from "./_ApiUrl";

export async function getApiStatus(): Promise<ApiStatus> {
  return await axios
    .get(API_URL("status"))
    .then((res) => {
      return { code: res.status, message: res.data };
    }).catch(err => {
      if (err.code === "ERR_NETWORK") {
        return { message: "The WikiData Universe API is currently offline. Try again later.", code: 500 };
      }
      return { message: "Unknown Error Encountered.", code: 404 };
    });
}