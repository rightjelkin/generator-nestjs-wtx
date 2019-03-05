import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { HttpStatus, Injectable, Middleware, NestMiddleware } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';

import { SECRET } from '../config/auth';
import { UserService } from './user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  public resolve(): (req: Request, res: Response, next: NextFunction) => void {

    return async (req: Request, res: Response, next: NextFunction) => {
      if (req.headers.authorization && (req.headers.authorization as string).split(' ')[0] === 'Token') {
        const token = (req.headers.authorization as string).split(' ')[1];
        const decoded: any = jwt.verify(token, SECRET);
        const user = await this.userService.findById(decoded.id);

        if (!user) {
          throw new HttpException('User not found.', HttpStatus.UNAUTHORIZED);
        }
        const userKey = 'user';
        req[userKey] = user.user;
        next();

      } else {
        throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);

      }
    };
  }
}
