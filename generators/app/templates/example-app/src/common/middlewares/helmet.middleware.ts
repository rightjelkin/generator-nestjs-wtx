import * as helmet from 'helmet';

import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class HelmetMiddleware implements NestMiddleware {
  public resolve(
    options?: helmet.IHelmetConfiguration
  ): (req: any, res: any, next: any) => void {
    return helmet(options);
  }
}
