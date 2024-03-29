import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
  }
}>()



app.post('/api/v1/signup',async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate())
const body = await c.req.json();

const user= await prisma.user.create({
  data: {
  email: body.email,
  password: body.password,
  }
  
})
const token = await sign({id: user.id}, "secret")


  return c.json({
    jwt: token
  }) 
})

app.post('/api/v1/signin',(c) => {
  return c.text('This is signin')
})

app.post('/api/v1/blog',(c) => {
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
