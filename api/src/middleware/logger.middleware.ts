import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`${req.protocol}://${req.headers.host}${req.baseUrl} \n Method: ${req.method} \n Status Code: ${res.statusCode}`);
    next();
  }
}
