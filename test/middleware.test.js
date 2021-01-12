const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const request = require('supertest');
const routerValidator = require('../index');
const router = new Router()

function App() {
  const app = new Koa();
  app.use(bodyParser());
  return app;
}


describe('test/test.js', function() {
	describe('ctx.query', function() {
    let app;
    beforeEach(function() {
      app = App();
    });
    it('should id is required', function(done) {
      router.get(
        '/',
        routerValidator({
          rule: {
            query: ['id']
          }
        })
      );
      app.use(router.routes())

      app.use(async (ctx) => {
        ctx.body = ctx.request.body
      })
  
      request(app.listen())
          .get('/')
          .expect(400, done)
    })
  });
});


