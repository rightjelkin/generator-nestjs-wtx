import * as clc from 'cli-color';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

import { LoggerTransport } from './logger.interface';

export class LoggerService {

  private logger: winston.Logger;
  private requestId: string;
  private context: string;

  constructor(
    level: string,
    serviceName: string,
    loggers: LoggerTransport[],
    path?: string,
    timeFormat: string = 'YYYY-MM-DD HH:mm:ss',
    fileDatePattern: string = 'YYYY-MM-DD',
    maxFiles: string = '10d',
    zippedArchive: boolean = false) {
    const transports = [];
    if (loggers && loggers.indexOf(LoggerTransport.CONSOLE) >= 0) {
      transports.push(new winston.transports.Console());
    }
    if (loggers && loggers.indexOf(LoggerTransport.ROTATE) >= 0) {
      const rotateLogger = new DailyRotateFile({
        filename: `${path}/${serviceName}-%DATE%.log`,
        datePattern: fileDatePattern,
        zippedArchive,
        maxFiles,
        options: { flags: 'a', mode: '0776' },
      });
      transports.push(rotateLogger);
    }

    this.logger = winston.createLogger({
      level,
      format: winston.format.combine(
        winston.format.timestamp({
            format: timeFormat,
          }),
          this.getLoggerFormat()
      ),
      transports,
  });
  }

  public setRequestId(id: string): void {
    this.requestId = id;
  }

  public getRequestId(): string {
    return this.requestId;
  }

  public setContext(ctx: string): void {
    this.context = ctx;
  }

  public log(msg: any, context?: string): void {
    this.info(msg, context);
  }

  public debug(msg: any, context?: string): void {
    this.logger.debug(msg, [{ context, reqId: this.requestId }]);
  }

  public info(msg: any, context?: string): void {
    this.logger.info(msg, [{ context, reqId: this.requestId }]);
  }

  public warn(msg: any, context?: string): void {
    this.logger.warn(msg, [{ context, reqId: this.requestId }]);
  }

  public error(msg: any, trace?: string, context?: string): void {
    this.logger.error(msg, [{ context }]);
    this.logger.error(trace, [{ context, reqId: this.requestId }]);
  }

  private getLoggerFormat(): any {
    return winston.format.printf(info => {
      const level = this.colorizeLevel(info.level);
      let message = info.message;
      if (typeof info.message === 'object') {
          message = JSON.stringify(message, undefined, 3);
      }
      let reqId = '';
      let context = '';
      if (info['0']) {
        const meta = info['0'];
        if (meta.reqId) {
          reqId = clc.cyan(`[${meta.reqId}]`);
        }
        const ctx = meta.context || this.context || undefined;
        if (ctx) {
          context = clc.blackBright(`[${ctx.substr(0, 20)}]`).padEnd(32);
        }
      }

      return `${info.timestamp} ${context}${level}${reqId} ${message}`;
    });
  }

  private colorizeLevel(level: string): string {
    let colorFunc: (msg: string) => string;
    switch (level) {
      default:
      case 'debug':
        colorFunc = (msg) => clc.blue(msg);
        break;
      case 'info':
        colorFunc = (msg) => clc.green(msg);
        break;
      case 'warn':
        colorFunc = (msg) => clc.yellow(msg);
        break;
      case 'error':
        colorFunc = (msg) => clc.red(msg);
        break;
    }

    // 17 because of the color bytes
    return colorFunc(`[${level.toUpperCase()}]`).padEnd(17);
  }
}
