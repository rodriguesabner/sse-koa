import { Readable } from 'stream';
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

  async registerClient(token: string, readStream: Readable, ctx: Context): Promise<void> {
    SseService.configureHeadersNotExpires(ctx);

    await this.sseMapper.save({
      // @ts-ignore
      token,
      readStream,
    });
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
    this.emitter.on('newFact', async (fact) => {
      const currentClient = await this.sseMapper.find(fact.clientId);

      if (!currentClient) {
        return;
      }

      if (fact.clientId === currentClient.id) {
        const { readStream } = currentClient;

        readStream.push(`data: ${JSON.stringify(fact.fact)}\n\n`);
        await this.sseMapper.delete(fact.clientId);
      }
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
