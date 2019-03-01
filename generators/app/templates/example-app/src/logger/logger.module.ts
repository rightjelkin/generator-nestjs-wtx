import { Global, Module } from '@nestjs/common';

import { LoggerTransport } from '../logger/logger.interface';
import { LoggerService } from '../logger/logger.service';

@Module({
  providers: [
    {
      provide: LoggerService,
      useFactory: () => {
        // logLevel: debug, info, warn or error
        // serviceName: daily rotate files will have this name
        // logAppenders: console or rotate
        // logFilePath: where daily rotate files are saved
        // timeFormat?: winston's time format syntax. Defaults to "YYYY-MM-DD HH:mm:ss".
        // fileDatePattern?: appended to daily rotate filename. Defaults to "YYYY-MM-DD".
        // maxFiles?: how long rotate files are stored. Defaults to "10d" which means 10 days.
        // zippedArchive: whether to zip old log file. Defaults to false.
        return new LoggerService('debug', 'Logger', [LoggerTransport.CONSOLE]);
      },
    },
  ],
  exports: [LoggerService],
})
export class LoggerModule {
}
