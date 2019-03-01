export interface LoggerInterface {
  debug(msg: any, context?: string): void;
  info(msg: any, context?: string): void;
  warn(msg: any, context?: string): void;
  error(msg: any, trace?: string, context?: string): void;
}

export enum LoggerTransport {
  CONSOLE = 'console',
  ROTATE = 'rotate',
}
