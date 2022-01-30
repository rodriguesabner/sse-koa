import Koa from 'koa';
import koaBody from "koa-body";
import cors from "koa-cors";
import {SseRoute} from './routes';
import compress from "koa-compress";

class Server {
    public app: Koa;

    constructor() {
        this.app = new Koa();

        this.config();
        this.routes();
    }

    config() {
        this.app.use(compress({
            filter(content_type: any) {
                return /text/i.test(content_type)
            },
            threshold: 2048,
            gzip: {
                flush: require('zlib').constants.Z_SYNC_FLUSH
            },
            deflate: {
                flush: require('zlib').constants.Z_SYNC_FLUSH,
            },
            br: false
        }))
        this.app.use(koaBody());
        this.app.use(cors({origin: "*"}));
    }

    routes() {
        new SseRoute(this.app);
    }

}

export default new Server().app;