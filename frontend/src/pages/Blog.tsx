import { useBlog } from "../hooks"
import { useParams } from "react-router-dom";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { FullBlog } from "../components/Fullblog";

export const Blog = () => {
    const {id} = useParams() ;
    const {loading,blog} = useBlog({
         id : id || "" 
    })
        
    if (loading) {
        return <div>
              <Skeleton count={27} /> 
            </div>
    }
    return <div>
       <FullBlog blog={blog} />
    </div>
    }