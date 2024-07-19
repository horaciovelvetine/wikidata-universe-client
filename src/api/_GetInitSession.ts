import axios from 'axios';
import { buildApiUrl } from '../functions';

export interface IGetInitSessionParams {
  query: string;
}

export interface IInitSessionResponse {
  data: any;
}

export async function getInitSessionRequest(props: IGetInitSessionParams): Promise<any> {
  const { query } = props;

  const response = await axios
    .get(buildApiUrl("v1/init-session"), {
      params: {
        query: query
      }
    })

  console.log(response)
}