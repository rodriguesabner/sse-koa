import Koa from 'koa';
import koaBody from "koa-body";
import cors from "koa-cors";
import {SseRoute} from './routes';

class Server {
    public app: Koa;

    constructor() {
        this.app = new Koa();

        this.config();
        this.routes();
    }

    config() {
        this.app.use(koaBody());
        this.app.use(cors({origin: "*"}));
    }

    routes() {
        SseRoute.init(this.app);
    }

}

export default new Server().app;