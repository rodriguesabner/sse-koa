import { Context } from 'koa';
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

    await this.sseService.registerClient(token, ctx);
  }

  async getUserInfo(ctx: Context) {
    const id = ctx.params.token;
    const newFact = ctx.request.body;

    await this.sseService.sendInfoToClient(id, newFact, ctx);
  }
}

export default SseController;
