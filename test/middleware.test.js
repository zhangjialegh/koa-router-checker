const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const request = require("supertest");
const routerValidator = require("../index");
const router = new Router();
const app = new Koa();
app.use(bodyParser());

describe("test/test.js", function () {
  describe("ctx.query is Array", function () {
    const server = app.listen();
    it("should id is required", function (done) {
      router.get(
        "/1",
        routerValidator({
          rule: {
            query: ["id"],
          },
        })
      );
      app.use(router.routes());

      request(server).get("/1").expect(
        {
          status: 400,
          message: "id is required",
        },
        done
      );
    });

    it("should id is required message 自定义消息", function (done) {
      router.get(
        "/2",
        routerValidator({
          message: "自定义消息",
          rule: {
            query: ["id"],
          },
        })
      );
      app.use(router.routes());

      request(server).get("/2").expect(
        {
          status: 400,
          message: "自定义消息",
        },
        done
      );
    });

    it("should OK", function (done) {
      router.get(
        "/5",
        routerValidator({
          message: "自定义消息",
          rule: {
            query: ["id"],
          },
        })
      );
      app.use(router.routes());
      app.use(async (ctx, next) => {
        if (!ctx.body) {
          ctx.body = {
            status: 200,
            message: "OK",
          };
        }
        await next();
      });

      request(server).get("/5").query({ id: "5" }).expect(
        {
          status: 200,
          message: "OK",
        },
        done
      );
    });
  });
  describe("ctx.query is Object", function () {
    const server = app.listen();
    it("should id is required status 500", function (done) {
      router.get(
        "/3",
        routerValidator({
          rule: {
            query: {
              id: {
                status: 500,
              },
            },
          },
        })
      );
      app.use(router.routes());

      request(server).get("/3").expect(
        {
          status: 500,
          message: "id is required",
        },
        done
      );
    });
  });

  describe("ctx.headers", function () {
    const server = app.listen();
    it("should message 未授权 status 401", function (done) {
      router.get(
        "/7",
        routerValidator({
          rule: {
            headers: {
              token: {
                status: 401,
                message: "未授权",
              },
            },
          },
        })
      );
      app.use(router.routes());

      request(server).get("/7").expect(
        {
          status: 401,
          message: "未授权",
        },
        done
      );
    });

    it("should OK", function (done) {
      router.get(
        "/8",
        routerValidator({
          message: "未授权",
          rule: {
            headers: {
              token: {
                status: 401,
              },
            },
          },
        })
      );
      app.use(router.routes());
      app.use(async (ctx, next) => {
        if (!ctx.body) {
          ctx.body = {
            status: 200,
            message: "OK",
          };
        }
        await next();
      });

      request(server).get("/8").set("token", "xx").expect(
        {
          status: 200,
          message: "OK",
        },
        done
      );
    });
  });
});
