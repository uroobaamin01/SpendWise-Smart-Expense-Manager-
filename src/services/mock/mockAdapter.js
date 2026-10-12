/**
 * An Axios adapter that answers requests from an in-browser database.
 * Services and components talk to it exactly as they would talk to a real REST API.
 */
import { AxiosError } from 'axios';
import { handleRequest, HttpError } from './mockRoutes';

const NETWORK_DELAY_MS = 450;

export function mockAdapter(config) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const { status, data } = handleRequest(config);
        resolve({ data, status, statusText: 'OK', headers: {}, config, request: {} });
      } catch (error) {
        if (!(error instanceof HttpError)) {
          reject(error);
          return;
        }
        const response = {
          data: { message: error.message, errors: error.errors },
          status: error.status,
          statusText: 'Error',
          headers: {},
          config,
          request: {},
        };
        reject(new AxiosError(error.message, AxiosError.ERR_BAD_REQUEST, config, {}, response));
      }
    }, NETWORK_DELAY_MS);
  });
}
