import { Context } from "hono";
import { createMiddleware } from "hono/factory";

// Middleware for read raw body
const rawBodyMiddleware = createMiddleware( async (c: Context, next) => {
    const reader = c.req.raw.body?.getReader()
    const chunks: Uint8Array[] = []
    if (reader) {
      let done = false
      while (!done) {
        const { value, done: readerDone } = await reader.read()
        if (value) chunks.push(value)
        done = readerDone
      }
    }
    c.set('rawBody', Buffer.concat(chunks));
    await next();
});

export default rawBodyMiddleware;