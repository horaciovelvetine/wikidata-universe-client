import axios from "axios";
import { buildApiUrl } from "../functions";
import { IApiStatus, ISessionData } from "../interfaces";

interface GetInitQueryDataRequestProps {
  queryVal: string;
}

interface GetInitQueryDataResponse {
  status: IApiStatus;
  data: ISessionData;
}


export async function getInitQueryDataRequest({ queryVal }: GetInitQueryDataRequestProps): Promise<GetInitQueryDataResponse> {
  return await axios.get(buildApiUrl("init-query-data"), {
    params: {
      query: queryVal
    }
  }).then(res => {
    return { status: { code: 200, message: "OK" }, data: res.data };
  }).catch(err => {
    console.error(err);
    return {
      status: { code: 500, message: "Internal Server Error" }, data: {} as ISessionData
    }
  });
}