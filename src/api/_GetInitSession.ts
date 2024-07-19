import axios from 'axios';
import { buildApiUrl } from '../functions';
import { IDimensions } from '../interfaces';

export interface IGetInitSessionParams {
  query: string;
  dimensions: IDimensions;
}

export async function getInitSessionRequest({ query, dimensions }: IGetInitSessionParams): Promise<any> {
  const strDimensions = `${dimensions.width}x${dimensions.height}`;
  return await axios
    .get(buildApiUrl("v1/init-session"), {
      params: {
        query, dimensions: strDimensions
      }
    })
}