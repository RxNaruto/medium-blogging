import { Hono } from "hono";
import { Prisma, PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'
export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
      },
    Variables: {
        userId: string;
    }
}
>(); 

blogRouter.use("/*", async(c,next)=>{
    const authHeader = c.req.header("authorization") || " ";
    const user = await verify(authHeader,"secret")

    if(user){
        c.set("userId", user.id);
       await  next();
    }
    else{
        c.status(403);
        return c.json({
            msg: "You are not authorized"
        })
    }

  
})

blogRouter.post('/',async (c) => {

    const body = await c.req.json();
    const authorId = c.get("userId");
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const post = await prisma.post.create({
        data:{
            title: body.title,
            content: body.content,
            authorid: Number(authorId)

        }
    })
    return c.json({
        id: post.id
    })
  })
  
  blogRouter.put('/',async (c) => {

    const body = await c.req.json();
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const post = await prisma.post.update({

        where: {
         id: Number(body.id)
        },
        data: {
            title: body.title,
            content: body.content,
            

        }
    })
    return c.json({
        id: post.id
    })
  })
  
  blogRouter.get('/bulk',async(c)=>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const post = await prisma.post.findMany();

 
    return c.json({
        post
    })
})

  
  blogRouter.get('/:id',async (c) => {

    const id = await c.req.param("id");
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try{
        const post = await prisma.post.findFirst({
            where: {
                id: Number(id)
               },
        })
        return c.json({
            post
        });
    }catch(e){
        c.status(411);
        return c.json({
            msg: "unexpected error occured"
        })

    }
  })
  

