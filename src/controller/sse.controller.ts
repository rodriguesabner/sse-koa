import EventEmitter from 'events';
import { PassThrough, Readable } from 'stream';
import { Context, Next } from 'koa';
import SseService from '../services/sse.service';

class SseController {
  private clients: any[];

  private emitter: EventEmitter;

  constructor(readonly service: SseService) {
    this.clients = [];
    this.emitter = new EventEmitter();
    this.emitter.setMaxListeners(0);
    this.service = service;
  }

  async register(ctx: Context) {
    const { token } = ctx.params;
    await this.service.registerClient(token, ctx);
  }

  async getUserInfo(ctx: Context) {
    const id = ctx.params.token;
    const newFact = ctx.request.body;

    const data = {
      clientId: id,
      fact: newFact,
      counter: 0,
    };

    ctx.body = newFact;
    ctx.status = 200;

    this.emitter.emit('newFact', data);
  }
}

export default SseController;
