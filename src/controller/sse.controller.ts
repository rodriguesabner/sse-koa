import { Context } from 'koa';
import SseService from '../services/sse.service';

class SseController {
  private sseService: SseService;

  constructor() {
    this.sseService = new SseService();
  }

  async register(ctx: Context) {
    const { token } = ctx.params;
    await this.sseService.registerClient(token, ctx);
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
