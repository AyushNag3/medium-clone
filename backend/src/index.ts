import { Hono } from 'hono'
import { decode, sign, verify } from 'hono/jwt'
import { cors } from 'hono/cors'
// import {env} from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import {userRouter} from './routes/user'
import {blogRouter} from './routes/blog'
import { withAccelerate } from '@prisma/extension-accelerate'

const app = new Hono<{
  Bindings : {
    DATABASE_URL : string,
    JWT_SECRET: string,
  }
}>()
app.use('/*', cors())
app.route('api/v1/user', userRouter) ;
app.route('api/v2/blog',blogRouter) ;


export default app;