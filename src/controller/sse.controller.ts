import { Context } from 'koa';
import { PassThrough, Readable } from 'stream';
import SseService from '../services/sse.service';

class SseController {
  private sseService: SseService;

  constructor() {
    this.sseService = new SseService();
  }

  async register(ctx: Context) {
    const { token } = ctx.params;

    if (!token) {
      ctx.status = 400;
      ctx.body = {
        message: 'Token is required',
      };
      return;
    }

    const stream = new PassThrough();
    const readStream = new Readable();

    // eslint-disable-next-line no-underscore-dangle
    readStream._read = () => {
    };

    ctx.body = readStream.pipe(stream, { end: false });

    await this.sseService.registerClient(token, readStream, ctx);
  }

  async getUserInfo(ctx: Context) {
    const id = ctx.params.token;
    const newFact = ctx.request.body;

    const ret = await this.sseService.sendInfoToClient(id, newFact);

    ctx.body = ret.body;
    ctx.status = ret.statusCode;
  }
}

export default SseController;
