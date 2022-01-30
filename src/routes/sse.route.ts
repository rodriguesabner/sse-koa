import Router from "koa-router";
import SseController from "../controller/sse.controller";
import Koa from "koa";

function init(app: Koa) {
    const router = new Router({prefix: "/sse"});
    const controller = new SseController();

    router.get(
        "/:token",
        "/:token",
        controller.register.bind(controller)
    );

    router.post(
        "/:token",
        "/:token",
        controller.getUserInfo.bind(controller)
    );

    app.use(router.routes());
    app.use(router.allowedMethods());
}

export default {
    init
};