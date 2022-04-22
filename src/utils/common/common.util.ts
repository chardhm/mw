/* import { Express } from 'express';
import asyncWrapper from 'async-wrapper-express-ts';
import { Route } from '../../routes/routes.types';

//Routes to export and use for middleware, structure url: domain:port/api/API_VERSION/Route(path)
export const applyRoutes = (app: Express, routes: Route[]) => {
  const version = 'v1';
  for (const route of routes) {
    const { method, path, middlewares, handler } = route;
    const enhancedPath = `/api/${version}${path}`;
    app[method](enhancedPath, ...middlewares, asyncWrapper(handler));
  }
}; */
