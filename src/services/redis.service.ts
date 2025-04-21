import {
  BadGatewayException,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createClient } from 'redis';
import { Repository } from 'typeorm';

import { RolesFunctional } from 'src/entities/roles_functional.entity';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private redisClient;

  constructor(
    @InjectRepository(RolesFunctional)
    private readonly rolesFunctionalsRepository: Repository<RolesFunctional>,
  ) {
    this.redisClient = createClient({
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
      socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        rejectUnauthorized: false,
        // tls: true,
        // ca: process.env.REDIS_CA_CERT,
        // minVersion: 'TLSv1.3',
      },
    });

    this.redisClient.on('error', (err) =>
      console.log('Redis Client Error', err),
    );
  }

  async onModuleInit() {
    await this.redisClient.connect();
  }

  async onModuleDestroy() {
    await this.redisClient.quit();
  }

  async ensureConnection() {
    if (!this.redisClient.isOpen) {
      try {
        await this.redisClient.connect();
        console.log('Redis reconnected successfully');
      } catch (err) {
        console.error('Redis reconnection failed:', err);
      }
    }
  }

  async get(key: string): Promise<string | null> {
    await this.ensureConnection();
    return this.redisClient.get(key);
  }

  async set(
    key: string,
    value: string,
    options?: { EX?: number },
  ): Promise<void> {
    await this.ensureConnection();
    await this.redisClient.set(key, value, options);
  }

  async del(key: string): Promise<void> {
    await this.ensureConnection();
    await this.redisClient.del(key);
  }

  async cacheFunctionalsByRole(
    roleId: number,
    functionalCodes?: string[],
  ): Promise<string[]> {
    try {
      let functionals: string[] = functionalCodes;
      const roleCacheKey = `functionals:role:${roleId}`;

      if (!functionalCodes) {
        const rolesFunctionals = await this.rolesFunctionalsRepository.find({
          where: { rolesId: roleId },
          relations: ['functional'],
        });

        functionals = rolesFunctionals.map((rf) => rf.functional.code);
      }

      await this.set(roleCacheKey, JSON.stringify(functionals), {
        EX: 3600 * 24 * 7,
      });

      return functionals;
    } catch (error) {
      console.error(
        `[Redis Error]: Caching functionals for role ${roleId}:`,
        error,
      );
      throw new BadGatewayException(error);
    }
  }

  async getFunctionalsFromCacheByRole(roleId: number): Promise<string[]> {
    try {
      const roleCacheKey = `functionals:role:${roleId}`;
      const data = await this.get(roleCacheKey);

      if (data) return JSON.parse(data);

      return this.cacheFunctionalsByRole(roleId);
    } catch (error) {
      console.error(`Error fetching functionals for role ${roleId}:`, error);
      throw error;
    }
  }
}
