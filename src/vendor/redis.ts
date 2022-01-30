import Redis from "ioredis";

class cache {
    private redis: Redis.Redis;

    constructor() {
        this.redis = new Redis(
            // @ts-ignore
            process.env.REDIS_HOST || "localhost",
            process.env.REDIS_PORT || 6379,
            "cache-:"
        );
    }

    async get(key: string) {
        const value = await this.redis.get(key);

        return value ? JSON.parse(value) : null;
    }

    set(key: string, value: string, timeExp: string) {
        return this.redis.set(key, JSON.stringify(value), "EX", timeExp);
    }

    del(key: string) {
        return this.redis.del(key);
    }

    async delPrefix(prefix: string) {
        const keys = (await this.redis.keys(`cache:${prefix}:*`)).map((key) =>
            key.replace("cache:", "")
        );

        return this.redis.del(keys);
    }
}

module.exports = new cache();