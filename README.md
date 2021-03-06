# params-expect

Simple package for validate request body in Koa, Express... or anywhere.

## Install

```sh
$ npm i params-expect
```

## Usage

### Express

```js
const express = require('express');
const bodyParser = require('body-parser');
const expect = require('params-expect/express');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.params = {
    ...req.params,
    ...req.query,
    ...req.body,
  };

  next();
});

app.post(
  '/users',
  expect({
    age: {
      type: Number,
      validate: age => age >= 18,
    },
    name: String,
    hobby: {
      type: String,
      required: false,
    },
  }),
  (req, res) => {
    if (req.validationErrors && req.validationErrors.length) {
      res.status(400).json({
        error: `Bad request data: ${req.validationErrors.join(', ')}`, 
      });
      
      return;
    }
    
    // business logic here ...
  },
);

app.listen(process.env.PORT);
```

### Koa

```js
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const expect = require('params-expect/koa');

const app = new Koa();
const router = new Router();

router.post(
  '/goals',
  expect({
    text: String,
    date: Number,
  }),
  (ctx) => {
    // business logic here ...
  },
);

app.use(bodyParser());

app.use(async (ctx, next) => {
  ctx.params = {
    ...ctx.params,
    ...ctx.query,
    ...ctx.request.body,
  };

  await next();
});

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {    
    ctx.status = err.status || 500;
    ctx.body = err.message || 'Server error.';
  }
});

app.use(router.routes());

app.listen(process.env.PORT);
```

### Abstract

```js
const createSchema = require('params-expect');

const expect = createSchema({
  foo: String,
});

const errors = expect({});
```
