import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaClientOptions } from '@prisma/client/runtime/library';

@Injectable()
export class PrismaService
  extends PrismaClient<PrismaClientOptions, 'query'>
  implements OnModuleInit
{
  private readonly logger: Logger;

  constructor() {
    super({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
      ],
    });
    this.logger = new Logger(PrismaService.name);
  }

  async onModuleInit() {
    this.$on('query', (e) => {
      this.logger.log(
        JSON.stringify({
          Query: e.query,
          Params: e.params,
          Duration: e.duration,
        }),
      );
    });
    await this.$connect();
  }
}
