import { Request } from 'express';
import { Observable } from 'rxjs';

import { ExecutionContext, HttpService, Injectable, NestInterceptor } from '@nestjs/common';

import { LoggerService } from './logger.service';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService, private readonly httpService: HttpService) {}
  public intercept(context: ExecutionContext, call$: Observable<any>): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();
    const requestId = request.header('x-request-id');
    this.logger.setRequestId(requestId);
    this.httpService.axiosRef.defaults.headers.common['x-request-id'] = requestId;
    return call$;
  }
}
