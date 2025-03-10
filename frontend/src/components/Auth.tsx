import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupInput} from '../../../common/src/index'
import axios from 'axios' ;
import { BACKEND_URL } from "../pages/config";

export const Auth = ({type} : {type : "Signin" | "Signup"}) => {
    const navigate = useNavigate() ;
    const [postInputs,setpostInputs] = useState<signupInput>({
        email : "",
        password : "",
        name  : ""
    });
    async function sendRequest() {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type === "Signup" ? "signup" : "signin"}`, postInputs) ;
            const jwt = response.data.header ;
            const name = response.data.name ;
            localStorage.setItem("token",jwt) ;
            localStorage.setItem("name",name) ;
            navigate("/blogs")
        }
        catch(e) {

        }
    }
    return (
        <div className="h-screen flex justify-center flex-col">
           <div className="flex justify-center">
              <div>
                <div className="px-10 py-10">
                    
                    <div className="text-3xl font-bold">
                        Create an account
                    </div>
                    <div className="text-slate-400">
                        {type === "Signin" ? "Don't have an account ?" : "Already have an account ?"}
                        
                        {type === "Signin" ? <Link className="pl-2 underline" to = {"/"}>
                        "Sign Up" 
                        </Link> :
                         <Link className="pl-2 underline" to = {"/signin"}>
                         "Sign In" 
                         </Link>}
                    </div>
                </div>
                    <div> { type === "Signup" ? <LabelInput label="Name" placeholder="" onChange={(e) => {
                        setpostInputs({
                            ...postInputs,
                        name : e.target.value
                        })
                        }} /> : null}
                        
                        <LabelInput label="Username" placeholder="" onChange={(e) => {
                            setpostInputs({
                                ...postInputs,
                            email : e.target.value
                            })
                        }} />
                        <LabelInput label="Password" type={"password"} placeholder="" onChange={(e) => {
                            setpostInputs({
                                ...postInputs,
                            password : e.target.value
                            })
                        }} />
                    </div>
                 <div className="">
                 <button onClick={sendRequest} type="button" className="mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">{type === "Signin" ? "Sign In" : "Sign Up" }</button>
                 </div>
                </div>
             </div>
        </div> 
            
    )
}

interface labelInputType{
    label : string ;
    placeholder : string ; 
    onChange : (e : ChangeEvent<HTMLInputElement>) => void;
    type? : string;
}

function LabelInput({label, placeholder, onChange, type} : labelInputType) {
    return     <div>
    <label className="block mb-2 text-sm font-medium text-gray-900 text-left">{label}</label>
    <input onChange={onChange} type={type || "text"} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
    placeholder={placeholder} required />
</div>

}