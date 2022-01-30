import { PassThrough, Readable } from 'stream';
import { Context } from 'koa';
import EventEmitter from 'events';
import SseMapper from '../mapper/sse.mapper';

class SseService {
  private emitter: EventEmitter;

  private readonly sseMapper: SseMapper;

  constructor() {
    this.emitter = new EventEmitter();
    this.emitter.setMaxListeners(0);
    this.sseMapper = new SseMapper();
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
        readStream() {
          return readStream;
        },
      };

      await this.sseMapper.save(toStore);
    }

    await this.configureEventEmmiter();
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

  private async configureEventEmmiter() {
    this.emitter.on('newOrder', async (order) => {
      const currentClient = await this.sseMapper.find(order.clientId);

      if (currentClient == null) {
        return;
      }

      if (order.clientId === currentClient.clientId) {
        const { readStream } = currentClient;
        console.log(readStream);

        // @ts-ignore
        readStream(`data: ${JSON.stringify(order.order)}\n\n`);
        await this.sseMapper.delete(order.clientId);
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
