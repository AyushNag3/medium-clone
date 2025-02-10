import {Link} from "react-router-dom";

interface BlogCardprops {
   id : Number,
   authorName : string,
   title : string,
   content : string,
   publishedDate : string
}
// interface name {
//    name : string   // Another way to define the type for avatar
// }
export const BlogCard = ({
    id,
    authorName,
    title, 
    content,
    publishedDate
} : BlogCardprops) => {
  const nameNull : string = "Anonymous"
   return <Link to={`/blog/${id}`} >
   <div className=" border-b border-slate-200 p-6 w-screen max-w-screen-md cursor-pointer">
      
     <div className="flex pb-2 ">
        <div className="">
            <Avatar size="small" name = {authorName ? authorName : nameNull} />
        </div>
        
        <div className=" pl-2 pr-2 ">
            {authorName}
        </div>
        <div className=" self-center pr-2">
         <Circle/>
        </div>
        <div className="font-thin">
            {publishedDate}
        </div>
       {/*   text-left : Makes sures the text starts from left */}
     </div>
     
     <div className="text-left ">
        <div className="flex justify-start text-xl font-bold self-stretch">
          {title}
        </div>
        <div className="flex justify-start pr-4 text-md font-thin self-stretch">
          {content.slice(0, 100) + "..."}
        </div>
        <div className="flex justify-start font-thin text-sm text-slate-400 pb-2 self-stretch">
          {`${Math.ceil(content.length / 100)} minute(s) read`}
        </div>
      </div>

    
     {/* <div className="bg-slate-200 h-1 w-full ">

     </div> */}
   </div>
 </Link>
}

function Circle() {
   return <div className="h-1 w-1 rounded-full bg-slate-600">

   </div>
}

export function Avatar({name, size = "small"} : {name:string, size:"small" | "big"} ) {
   return <div>
<div className={`relative text-base inline-flex items-center justify-center ${size === "small" ? "w-6 h-6" : "w-10 h-10"} overflow-hidden bg-gray-300 rounded-full dark:bg-gray-600`}>
    <span className={` ${size === "small"? "text-xs": "text-lg" } text-black-600 dark:text-gray-300`}>{name[0].toUpperCase()}</span>
</div>
   </div>
}