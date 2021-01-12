const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const http = require("http");
const request = require("supertest");
const app = new Koa();
const routerValidator = require("../index");
const router = new Router();

app.use(bodyParser());
router.get(
  "/2",
  routerValidator({
    rule: {
      query: {
        id: {
          message: "自定义消息",
        },
      },
    },
  })
);
app.use(router.routes());

// app.use(async (ctx) => {
//   console.log(ctx.body, "body");
// });

app.listen(8005, () => {
  console.log("listen port 8005");
});
