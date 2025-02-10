
import { Blog, useBlog } from "../hooks"
import { useParams } from "react-router-dom"
import { Appbar } from "./Appbar"
import { Avatar } from "./BlogCard"

export const FullBlog = ({blog} : {blog: Blog}) => {
    const userName: string = localStorage.getItem("name") || "";
    return <div>
        <Appbar name = {blog.author.name}/>
    <div className="flex justify-center">
    <div className="grid grid-cols-12 px-10 w-full pt-100 max-w-screen-xl pt-12">
        <div className="col-span-8 text-left">
        <div className="text-5xl font-extrabold "> 
            {blog.title}
        </div>
        <div className="text-slate-500 pt-2 pr-20">
          Post on 2nd December 2024
        </div>
        <div className="pt-4">
          {blog.content}
        </div>
      </div>
      <div className="col-span-4">
        <div className="text-slate-600 text-lg pl-10 text-left">
            Author
        </div>
        <div className="flex w-full"> 
            <div className="pl-10 flex flex-col justify-center ">
                <Avatar size="big" name = {blog.author.name? blog.author.name : "Anonymous"}/>
            </div>
          <div>
              <div className="text-xl font-bold pr-20 ">
                 {blog.author.name || "Anonymous"}
              </div>
               <div className="pt-2 flex flex-col justify-center text-slate-500">
                  Random catch phrase about the author's ability to grab the user's attention
               </div>
          </div>
        </div>
       
      </div>
    </div>
   </div>
   </div>
}