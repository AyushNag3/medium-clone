
import { BlogCard } from "../components/BlogCard"
import { Appbar } from "../components/Appbar"
import { useBlogs } from "../hooks"
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export const Blogs =() => {
  const userName:any = localStorage.getItem("name") ;
  const {loading,blogs} =   useBlogs() ;  
  if (loading) {
    return <div>
      <Skeleton count={27} /> 
    </div>
  }
  return <div>
    <Appbar name = {userName ? userName : "Anonymous"}/>
  <div className=" flex justify-center pt-6 ">
    <div className="">
      {blogs.map(blog => 
             <BlogCard
             id = {blog.id}
             authorName = {blog.author.name || "Anonymous"}
             title = {blog.title}
             content = {blog.content}
             publishedDate = {"12th Feb 2024"}
            />
      )}



    </div>
    </div>
 </div>
}