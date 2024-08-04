import axios from 'axios';
import { buildApiUrl } from '../functions';
import { IDimensions } from '../interfaces';
import { formatWindowSizeString } from '../functions';

export interface IGetInitSessionParams {
  query: string;
  dimensions: IDimensions;
}

export async function getInitSessionRequest({ query, dimensions }: IGetInitSessionParams): Promise<any> {
  return await axios.get
    (buildApiUrl("init-session"), {
      params: {
        query, dimensions: formatWindowSizeString(dimensions)
      }
    }).then((response) => {
      return {
        status: response.status,
        data: response.data
      };
    }).catch(error => {
      console.log("Error getInitSessionRequest():", error.message)
      return error
    });
}