import Redis from 'ioredis';

class Cache {
  private redis: Redis.Redis;

  constructor() {
    this.redis = new Redis(
      // @ts-ignore
      process.env.REDIS_HOST || 'localhost',
      process.env.REDIS_PORT || 6379,
      'cache-:',
    );
  }

  async get(key: string) {
    const value = await this.redis.get(key);

    return value ? JSON.parse(value) : null;
  }

  set(key: string, value: object, timeExp: number = 60 * 15) {
    return this.redis.set(key, JSON.stringify(value), 'EX', timeExp);
  }

  del(key: string) {
    return this.redis.del(key);
  }

  async delPrefix(prefix: string) {
    const keys = (await this.redis.keys(`cache:${prefix}:*`)).map((key) => key.replace('cache:', ''));

    return this.redis.del(keys);
  }
}

export default Cache;
