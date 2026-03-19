import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

export type JwtTokenPayload = {
  id: string;
  email: string;
  exp: number;
  iat: number;
};

interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string };
}

@Injectable()
export class AuthJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    //const token = this.extractTokenFromHeader(request);
    const token = this.extractTokenFromCookies(request);
    if (!token) {
      throw new UnauthorizedException(
        'Missing or invalid authorization header',
      );
    }

    try {
      const decoded: JwtTokenPayload = await this.jwtService.verifyAsync(token);
      // Set decode as user in request
      request.user = { id: decoded.id, email: decoded.email };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) return undefined;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }

  private extractTokenFromCookies(request: Request): string | undefined {
    // Type cast cookies as object with 'jwt' property for TypeScript safety
    const cookies = request.cookies as { jwt?: string } | undefined;
  
    return cookies?.jwt;
  }
}
