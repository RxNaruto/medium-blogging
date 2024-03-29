import { Hono } from 'hono'
import { Prisma, PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
  }
}>()

app.route("api/v1/user" , userRouter);
app.route("api/v1/blog",blogRouter);



app.get('/api/v1/blog/test',(c) => {
  return c.text('This is blog')
})

app.put('/api/v1/blog',(c) => {
  return c.text('This is blog2')
})

app.get('api/v1/blog/:id',(c)=>{
  return c.text('This is blog3')
})
app.get('/api/v1/admin',(c)=>{
  return c.text('this is admin')
})

export default app
