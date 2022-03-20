const http = require('http');
const Koa = require('koa');
const Router = require('@koa/router');
const Mount = require('koa-mount');
const BodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');

const uuid = require('uuid')
const {faker} = require('@faker-js/faker');


const v1Router = new Router();

v1Router.get('/messages/unread', (ctx, next) => {
    const messages = []
    const quantity = Math.floor(Math.random() * 5)
    for (let index = 1; index <= quantity; index++) {
        const email = faker.internet.email()
        const message = {
            id: uuid.v4(),
            from: email,
            subject: "Hello from " + email.slice(0, email.indexOf('@')),
            body: faker.lorem.text(),
            received: Date.now(),
        }
        messages.push(message)
    }
    ctx.body = messages;
    ctx.status = 200;
});

const appV1 = new Koa();

appV1.use(BodyParser());

appV1.use(v1Router.routes())

const app = new Koa();

app.use(cors());
app.use(Mount('/v1', appV1));

const port = process.env.PORT || 80
const server = http.createServer(app.callback()).listen(port);
console.log(port)