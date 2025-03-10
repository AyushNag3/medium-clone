import { useEffect,useState } from "react";
import axios from "axios" ;
import { BACKEND_URL } from "../pages/config";

export interface Blog{
    "content" : string;
    "title" : string;
    "id" : number;
    "author" : {
        "name" : string;
    }
}

export const useBlog = ({id} : {id:string}) => {
    const [loading,setloading] = useState(true) ;
    const [blog, setblog] = useState<Blog|null>(null) ;
    useEffect( () => {
          axios.get(`${BACKEND_URL}/api/v2/blog/${id}`, {
             headers : {
                 Authorization : "Bearer " + localStorage.getItem("token")
             }
          })
          .then((response) => {
             setblog(response.data.post);  
             setloading(false) ;
          })
    }, [id] )
    return {
     blog,
     loading
    }
}

export const useBlogs  = () => {
   const [loading,setloading] = useState(true) ;
   const [blogs, setblogs] = useState<Blog[]>([]) ;
   useEffect( () => {
         axios.get(`${BACKEND_URL}/api/v2/blog/bulk`, {
            headers : {
                Authorization : "Bearer " + localStorage.getItem("token")
            }
         })
         .then((response) => {
            setblogs(response.data.posts);  
            setloading(false) ;
         })
   }, [] )
   return {
    blogs,
    loading
   }
} ;
 