import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { use } from "passport";

@Injectable()
export class IsAuth implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    try {
      const auth = req.headers.authorization as string;
      const bearer = auth.split(" ")[0];
      const token = auth.split(" ")[1];
      if (bearer !== "Bearer" || !token) {
        return false;
      }
      const user = await this.jwtService.verify(token);
      if (!user) {
        return false;
      }
      req.user = user;
      return true;
    } catch (err) {
      return false;
    }
  }
}

@Injectable()
export class IsAmin implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    try {
      const auth = req.headers.authorization as string;
      const bearer = auth.split(" ")[0];
      const token = auth.split(" ")[1];
      if (bearer !== "Bearer" || !token) {
        return false;
      }
      const user = await this.jwtService.verify(token);
      if (!user || !user.isAdmin) {
        return false;
      }
      req.user = user;
      return true;
    } catch (err) {
      return false;
    }
  }
}