import { Hono } from 'hono'
import { decode, sign, verify } from 'hono/jwt'
// import {env} from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { signupInput, signinInput} from '../../../common/dist/index'
export const userRouter = new Hono<{
    Bindings : {
      DATABASE : string,
      JWT_SECRET: string,
    }
  }>()

userRouter.post('signup', async (c) => { 
    const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE,  
}).$extends(withAccelerate())

const body = await c.req.json() ;
const {success} = signupInput.safeParse(body) ;
if (!success) {
  c.status(411) ;
  return c.json({
    message : "Inputs not correct"  
  }) 
}
try {
const user =  await prisma.user.create({
  data : { //@ts-ignore
    name : body.name,
    email : body.email  ,
    password : body.password,
  },
})
if (!user) {
  c.status(403) ;
  return c.json({
    message : "Incorrect Credentials"
  })
}

const token = await sign({id : user.id}, c.env.JWT_SECRET) ;
const name = user.name ;
return c.json({
  header : token  ,
  name
}) ; 
} catch(e) {
  console.log(e) ;
  c.status(411);
  return c.text('Invalid') ;
   }
})

userRouter.post('signin', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE	,
    }).$extends(withAccelerate());

    const body = await c.req.json();
    const {success} = signinInput.safeParse(body) ;
if (!success) {
  c.status(411) ;
  return c.json({
    message : "Inputs not correct"  
  }) 
}
    const user = await prisma.user.findUnique({
        where: {
            email: body.email
        }
    });

    if (!user) {
        c.status(403); // unauthorized
        return c.json({ error: "user not found" });
    }

    const header = await sign({ id: user.id }, c.env.JWT_SECRET);
    const name = user.name ;
    return c.json({ header, name });
})







