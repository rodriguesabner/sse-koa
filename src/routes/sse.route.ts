import Router from 'koa-router';
import Koa from 'koa';
import SseController from '../controller/sse.controller';
import { SseInterfaceConstructor } from '../interfaces/sse.interface';

class SseRoute implements SseInterfaceConstructor {
  public router: Router;

  private readonly controller: SseController;

  constructor(readonly app: Koa) {
    this.controller = new SseController();
    this.router = new Router({ prefix: '/sse' });
    this.routes();

    app.use(this.router.routes());
    app.use(this.router.allowedMethods());
  }

  public routes() {
    this.router.get(
      'Register user by token',
      '/:token',
      this.controller.register.bind(this.controller),
    );

    this.router.post(
      'Send data to registered user (SSE Event)',
      '/:token',
      this.controller.getUserInfo.bind(this.controller),
    );
  }
}

export default SseRoute;
