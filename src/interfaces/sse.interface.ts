import Koa from 'koa';
import Stream, { Readable } from 'stream';

interface SseInterfaceConstructor {
    app: Koa;
}

interface SseResponseSendData {
    clientId: string;
    steam?: Stream;
    readStream?: Readable;
}

export {
  SseInterfaceConstructor,
  SseResponseSendData,
};
