import EventEmitter from 'events';
import {PassThrough, Readable} from "stream";
import {Context, Next} from "koa";

class SseController {
    private clients: any[];
    private emitter: EventEmitter;

    constructor() {
        this.clients = [];
        this.emitter = new EventEmitter();
        this.emitter.setMaxListeners(0);
    }

    async register(ctx: Context, next: Next) {
        const token = ctx.params.token;

        ctx.request.socket.setTimeout(0);
        ctx.req.socket.setNoDelay(true);
        ctx.req.socket.setKeepAlive(true);

        ctx.set({
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache'
        })

        const stream = new PassThrough();
        const readStream = new Readable();

        readStream._read = () => {
        };

        ctx.body = readStream
            .pipe(stream, {end: false});

        const newClient = {id: token, readStream};
        this.clients.push(newClient);

        this.emitter.on('newFact', (fact) => {
            const currentClient = this.clients.find((client) => client.id === fact.clientId);

            if (currentClient && fact.clientId === currentClient.id) {
                const readStream: Readable = currentClient.readStream;

                readStream.push(`data: ${JSON.stringify(fact.fact)}\n\n`);
                this.clients = this.clients.filter((client) => client.id !== fact.clientId);
                console.log(`Client ${fact.clientId} disconnected`);
            }
        });
    }

    async getUserInfo(ctx: Context) {
        const id = ctx.params.token;
        const newFact = ctx.request.body;

        const data = {
            clientId: id,
            fact: newFact,
            counter: 0
        };

        ctx.body = newFact;
        ctx.status = 200;

        this.emitter.emit('newFact', data);
    }
}

export default SseController;