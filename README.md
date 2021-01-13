# koa-router-checker

#### Validator middleware for [koa-router](https://github.com/koajs/router).

## Install

```js
npm i koa-router-checker --save
```

## Example

```js
'use strict';

const Koa = require('koa');
const Router = require('koa-router');
const koaRouterChecker = require('koa-router-checker');
const bodyparser = require('koa-bodyparser');
const app = new Koa()
const router = new Router()

app.use(bodyparser());


router.get('/', koaRouterChecker({
  // message [String, Function(key: string)] low priority
  message: function(key: string) {
    ...
  },
  // status [Number] low priority
  status: 400,

 /**
  * ctx.body
  * ctx.query
  * ctx.headers
  * ....
 */
  rule: {
    // body: ['name','password'] surrport Array
    body: {
      name: {
        status: 400,
        //[String, Function(key: id)] // high priority
        message: 'name is required'
      }
    },
    query: {
      id: {
        status: 400,
        //[String, Function(key: id)] // high priority
        message: 'id is required'
      }
    },
    headers: {
      token: {
        status: 401,
        // message [String, Function(key: token)] // high priority
        message: 'no auth'
      }
    }

    ...

    
  }
}), async(ctx,next) => {
  ...

  await next()

  ....
});

app.use(router.routes());

app.listen(5000);
```

```js
// ctx.body

ctx.body = {
  status: 400 //  default 400，the status of define
  message: 'xx is required' // default key is required， the message of define
}

```

## Test

see [test](https://github.com/zhangjialegh/koa-router-checker/blob/master/test/middleware.test.js).

```js
npm run test
```
