import { Hono } from 'hono'
import { Prisma, PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
  }
}>()

app.use('/api/v1/blog/*' , async(c,next)=>{
  const header = c.req.header("authorization") || "";
  const token = header.split(" ")[1];
  const response = await verify(header,"secret")
  if(response.id){
    next();
  }
  else{
    c.status(403)
    return c.json({error: "unauthorized"})
  }
  await next()
})

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

app.post('/api/v1/signin',async (c) => {

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate())
const body= await c.req.json();
const user= await prisma.user.findUnique({
  where: {
    email: body.email,
    password: body.password
  }
});

if(!user){
  c.status(403);
  return c.json({
    error: "User doesn't found"
  });
}
 

  const token = await sign({id: user.id}, "secret")

  return c.json({
    jwt: token
  })
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
