import { Hono } from 'hono'
import { decode, sign, verify } from 'hono/jwt'
// import {env} from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { auth } from 'hono/utils/basic-auth'
import { signupInput, signinInput, createblogInput, updateblog} from '../../../common/src/index'

export const blogRouter = new Hono<{
    Bindings : {
      DATABASE : string,
      JWT_SECRET: string,
    }
  }>()

  
blogRouter.use('/*',async (c, next) => {
	const jwt = c.req.header('Authorization');
    if (!jwt) {
        c.status(401);
        return c.json({ error: "unauthorized" });
    }
    const token = jwt.split(' ')[1];
    const payload = await verify(token, c.env.JWT_SECRET);
    if (!payload) {
        c.status(401);
        return c.json({ error: "unauthorized" });
    }
    //@ts-ignore
    c.set('userId', payload.id);
    await next();
});

blogRouter.post('/', async (c) => {
	try {
	  // Optionally retrieve the userId from the request context (ensure an authentication middleware sets this)

	  // Initialize Prisma with your database URL from environment variables
	  const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE,
	  }).$extends(withAccelerate());  //@ts-ignore
       const userId = c.get('userId') ;
	  // Parse and validate the request body
	  const body = await c.req.json();
	  const parsed = createblogInput.safeParse(body);
	  if (!parsed.success) {
		c.status(400);
		return c.json({
		  message: "Inputs not correct",
		  errors: parsed.error.errors,
		});
	  }
  
	  // Create the post in the database using validated data and the actual userId
	  const post = await prisma.post.create({
		data: {
		  title: body.title,
		  content: body.content,
		  authorId: Number(userId) // Use the authenticated user's id
		},
	  });
  
	  return c.json({ id: post.id });
	} catch (error) {
	  console.error("Error publishing blog:", error);
	  return c.json({ message: "Internal Server Error" }, 500);
	}
  });
  

blogRouter.get('/bulk', async (c) => {
	//@ts-ignore
	
	const prisma = new PrismaClient({
	  datasources: {
		db: {
		  url: c.env?.DATABASE,
		},
	  },
	}).$extends(withAccelerate());
  
	try {
	  const posts = await prisma.post.findMany({
		select: {
		  title: true,
		  content: true,
		  id: true,
		  author: {
			select: {
			  name: true,
			},
		  },
		},
	  });
	  return c.json({ posts });
	} catch (error) {
	  return c.json({ error: 'Failed to fetch posts' }, 500);
	}
  });

blogRouter.put('/', async (c) => { //@ts-ignore
	const userId = c.get('userId');
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE	,
	}).$extends(withAccelerate());
	const body = await c.req.json();
	const {success} = updateblog.safeParse(body) ;
if (!success) {
  c.status(411) ;
  return c.json({
    message : "Inputs not correct"  
  }) 
}
	const blog = await prisma.post.update({
		where: {
			id: body.id, //@ts-ignore
			
		},
		data: {
			title: body.title,
			content: body.content,
			
		}
	});

	return c.json({
		id : blog.id
		});
});

blogRouter.get('/:id', async (c) => {
	const id = c.req.param('id'); //@ts-ignore

	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE	,
	}).$extends(withAccelerate());
	 //@ts-ignore
	 try {
	const post = await prisma.post.findFirst({
		where: { //@ts-ignore
			id : Number(id),
		}, 
		select : {
			id : true ,
			title : true,
			content : true,
			author : {
				select : {
					name :  true 
				}
			}
		}
	});

	return c.json({
		post
	})
} catch(e) {
	c.status(411) ;
	return c.json({
		message : "Error while fetching blog post"
	})
}
})


