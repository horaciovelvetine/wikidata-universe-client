import axios from 'axios';
import { buildApiUrl } from '../functions';
import { IDimensions } from '../interfaces';
import { IWikidataUniverseSession } from '../interfaces';
import { formatWindowSizeString } from '../functions';

export interface IGetInitSessionParams {
  queryVal: string;
  dimensions: IDimensions;
}

export async function getInitSessionRequest({ }: IGetInitSessionParams): Promise<IWikidataUniverseSession> {
  return await axios.get
    (buildApiUrl("test-response")).then((response) => {
      return response.data;
    }).catch(error => {
      if (error.code === "ERR_NETWORK") {
        debugger;
      }

      if (error.code === "ERR_BAD_REQUEST") {
        debugger;
      }

      if (error.response.status === 404) {
        debugger;
      }

      if (error.response.status === 408) {
        debugger;
      }
      debugger;
    });
}