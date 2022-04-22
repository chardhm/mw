/* import { Route, Methods } from './routes.types';
import Container from 'typedi';
import ClientController from '../controllers/Client.controller';

const mainRoute = '/client';

export const clientRoutes: Route[] = [
  {
    path: `${mainRoute}`,
    method: Methods.POST,
    middlewares: [],
    handler: Container.get(ClientController).postData,
  },
];
 */