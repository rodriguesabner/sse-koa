import Koa from 'koa';
import SseRoute from './sse.route';

class Routes {
  private routeSSE: SseRoute;

  constructor(app: Koa) {
    this.routeSSE = new SseRoute(app);
    this.routes();
  }

  routes() {
    this.routeSSE.routes();
  }
}

export default Routes;
