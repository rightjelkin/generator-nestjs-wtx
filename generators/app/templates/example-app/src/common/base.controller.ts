import * as jwt from 'jsonwebtoken';

import { SECRET } from '../config/auth';

export class BaseController {

  protected getUserIdFromToken(authorization: any): any {
    if (!authorization) { return undefined; }

    const token = authorization.split(' ')[1];
    const decoded: any = jwt.verify(token, SECRET);
    return decoded.id;
  }
}
