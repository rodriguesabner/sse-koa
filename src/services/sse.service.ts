import { PassThrough, Readable } from 'stream';
import { Context } from 'koa';
import EventEmitter from 'events';
import SseMapper from '../mapper/sse.mapper';

class SseService {
  private emitter: EventEmitter;

  private readonly sseMapper: SseMapper;

  private clients: any[];

  constructor() {
    this.emitter = new EventEmitter();
    this.emitter.setMaxListeners(0);
    this.sseMapper = new SseMapper();
    this.clients = [];
  }

  async registerClient(token: string, ctx: Context): Promise<void> {
    SseService.configureHeadersNotExpires(ctx);

    const stream = new PassThrough();
    const readStream = new Readable();

    // eslint-disable-next-line no-underscore-dangle
    readStream._read = () => {
    };

    ctx.body = readStream.pipe(stream, { end: false });

    const currentClient = await this.sseMapper.find(token);
    if (currentClient == null) {
      const toStore = {
        token,
        readStream,
      };

      this.clients.push(toStore);
      await this.sseMapper.save(toStore);
    }

    this.configureEventEmitter();
  }

  private static configureHeadersNotExpires(ctx: Context): void {
    ctx.request.socket.setTimeout(0);
    ctx.req.socket.setNoDelay(true);
    ctx.req.socket.setKeepAlive(true);

    ctx.set({
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache',
    });
  }

  private configureEventEmitter() {
    this.emitter.on('newOrder', async (order) => {
      const redisCurrentClient = await this.sseMapper.find(order.clientId);
      const currentClientLocal = this.clients.find(
        (client) => client.token === order.clientId,
      );

      if (redisCurrentClient == null) {
        return;
      }

      if (order.clientId === redisCurrentClient.clientId) {
        try {
          // @ts-ignore
          redisCurrentClient.readStream.push(`data: ${JSON.stringify(order.order)}\n\n`);
        } catch (error) {
          currentClientLocal.readStream.push(`data: ${JSON.stringify(order.order)}\n\n`);
        } finally {
          await this.sseMapper.delete(order.clientId);
        }
      }
    });
  }

  async sendInfoToClient(id: string, orderData: any, ctx: Context): Promise<any> {
    const data = {
      clientId: id,
      order: orderData,
      counter: 0,
    };

    ctx.status = 200;
    ctx.body = data;

    this.emitter.emit('newOrder', data);
  }
}

export default SseService;
