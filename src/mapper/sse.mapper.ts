import { Readable } from 'stream';
import Cache from '../vendor/cache';

class SseMapper {
  private cache: Cache;

  constructor() {
    this.cache = new Cache();
  }

  async find({ clientId }: { clientId: string }) {
    const data = await this.cache.get(clientId);
    if (data) {
      return data;
    }
    return null;
  }

  async save({ clientId, readable }: { clientId: string, readable: Readable }) {
    const data = await this.cache.set(clientId, {
      clientId,
      readable,
    });
    return data;
  }

  async delete({ clientId }: { clientId: string }) {
    const data = await this.cache.del(clientId);
    return data;
  }
}

export default SseMapper;
