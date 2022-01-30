import Koa from 'koa';
import koaBody from 'koa-body';
import cors from 'koa-cors';
import compress from 'koa-compress';
import zlib from 'zlib';
import Routes from './routes';

class Server {
  public app: Koa;

  constructor() {
    this.app = new Koa();

    this.config();
    this.routes();
  }

  config() {
    this.app.use(compress({
      // eslint-disable-next-line camelcase
      filter(content_type: any) {
        return /text/i.test(content_type);
      },
      threshold: 2048,
      gzip: {
        flush: zlib.constants.Z_SYNC_FLUSH,
      },
      deflate: {
        flush: zlib.constants.Z_SYNC_FLUSH,
      },
      br: false,
    }));
    this.app.use(koaBody());
    this.app.use(cors({ origin: '*' }));
  }

  routes() {
    // eslint-disable-next-line no-new
    new Routes(this.app);
  }
}

export default new Server().app;
