import { Hono } from 'hono'
import { decode, sign, verify } from 'hono/jwt'
// import {env} from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { auth } from 'hono/utils/basic-auth'
import { signupInput, signinInput, createblogInput, updateblog} from '../../../common/src/index'
import { updatePostInput } from '@shivanandh33/medium-clone'
export const blogRouter = new Hono<{
    Bindings : {
      DATABASE_URL : string,
      JWT_SECRET: string,
    }
  }>()

  
blogRouter.use('*/',async (c, next) => {
    const jwt = c.req.header('Authorization') ;
	if (!jwt) {
		c.status(401);
		return c.json({ error: "unauthorized" });
	}
	const token = jwt.split(' ')[1];
	try {
	const payload = await verify(token, c.env.JWT_SECRET);
	if (payload) { //@ts-ignore
		c.set('userId', payload.id);   // payload.id is the value that gets stored in the key.
		await next()                   // The key-value pair ('userId': payload.id) is stored only for the duration of the request and can be accessed later within the same request cycle.
	} else {
		c.status(401);
		return c.json({ error: "unauthorized" });
	}
} catch(e) {
	c.status(403);
		return c.json({ error: "You are not logged in" });
}

});

blogRouter.post('/', async (c) => { //@ts-ignore
	const userId = c.get('userId');
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	const body = await c.req.json();
	const {success} = createblogInput.safeParse(body) ;
if (!success) {
  c.status(411) ;
  return c.json({
    message : "Inputs not correct"  
  }) 
}
	const post = await prisma.post.create({

		data: {
			title: body.title,
			content: body.content,//@ts-ignore
			authorId: 1
		}
	});
	return c.json({
		id: post.id
	});
})

blogRouter.get('/bulk', async (c) => {
	//@ts-ignore
	const userId = c.get('userId');
	const prisma = new PrismaClient({
	  datasources: {
		db: {
		  url: c.env?.DATABASE_URL,
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
		datasourceUrl: c.env?.DATABASE_URL	,
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
	const userId = c.get('userId');
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
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


