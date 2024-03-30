import { Hono } from "hono";
import { Prisma, PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'
import { signupInput } from '@xznaruto/mediumwebs-common';
export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
      }
}
>(); 


userRouter.post('/signup',async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  const body = await c.req.json();
  const {success} = signupInput.safeParse(body);
  if(!success){
    c.status(411);
    return c.json({
      msg: "Incorrect input"
    })
  }
  
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
  
userRouter.post('/signin',async (c) => {
  
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

userRouter.get("/test1",async(c)=>{
    return c.text("welcome to my blog")
})