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

    const newClient = { id: token, readStream };
    this.sseMapper.push(newClient);

    this.emitter.on('newFact', (fact) => {
      const currentClient = this.sseMapper.find(fact.clientId);

      if (currentClient && fact.clientId === currentClient.id) {
        const { readStream } = currentClient;

        readStream.push(`data: ${JSON.stringify(fact.fact)}\n\n`);
        this.sseMapper.delete(fact.clientId);
      }
    });
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

  async sendInfoToClient(id: string, clientData: any): Promise<any> {
    const data = {
      clientId: id,
      fact: clientData,
      counter: 0,
    };

    this.emitter.emit('newFact', data);

    return {
      statusCode: 200,
      body: data,
    };
  }
}

export default SseService;
