/* import { Request, Response, NextFunction } from "express";

// Common types for routes

export interface Route {
  path: string;
  method: Methods;
  middlewares: RouteHandler[];
  handler: RouteHandler;
}

// Common methods for routes
export enum Methods {
  GET = "get",
  POST = "post",
  PATCH = "patch",
  PUT = "put",
  DELETE = "delete",
  HEAD = "head",
  OPTIONS = "options"
}

type RouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response>;
 */