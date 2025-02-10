import { Appbar } from "../components/Appbar"
import axios from "axios" ;
import { BACKEND_URL } from "../pages/config";
import { useState } from "react";
import { useNavigate } from "react-router-dom";



     


 // alternative : const Blogdata = {title, content}
                                                           // write Blogdata, instead of {title,content}, 
               
      
 
export const Publish = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const navigate = useNavigate();
  
    const handlePublish = async () => {
      const publishedDate = new Date().toISOString();
  
      const blogData = {
        title,
        content,
        
      };
  
      try {
        const response = await axios.post(`${BACKEND_URL}/api/v2/blog`,blogData,{
          headers:{
            Authorization :localStorage.getItem("token")
          }
        });
  
        if (response.status === 200) {
          const { id } = response.data;
          alert("Blog published successfully!");
          setTitle("");
          setContent("");
          navigate(`/blog/${id}`)
        } else {
          alert("Failed to publish the blog.");
        }
      } catch (error) {
        console.error("Error publishing blog:", error);
        alert("An error occurred while publishing the blog.");
      }
    };
    const userName:string = localStorage.getItem("name") || ""
    return (
      <div className="min-h-screen bg-gray-100">
        <Appbar name={userName} />
        <div className="max-w-4xl mx-auto p-6">
          <div className="mb-4">
            <textarea
              className="w-full h-20 p-2 text-2xl font-semibold text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
              placeholder="Blog Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <textarea
              className="w-full h-64 p-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:border-green-500"
              placeholder="Write your blog content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <button
            onClick={handlePublish}
            className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none"
          >
            Publish
          </button>
        </div>
      </div>
    );
  };
  