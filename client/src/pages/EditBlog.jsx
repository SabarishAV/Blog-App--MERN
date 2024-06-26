import { useState,useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

import Auth from '../Auth'
import Author from "../Author"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import MessageTemplate from "./MessageTemplate"

function EditBlog(){

    const docURL = document.URL
    const id = docURL.split("/")[5]
    const url = import.meta.env.VITE_SERVER_URL
    let formData
    const userName = Author("username")
    const theAuthor = Author("author")

    const [data,setData] = useState()
    const [title,setTitle] = useState()
    const [content,setContent] = useState()
    const [author,setAuthor] = useState()
    const [isBlogEdited,setIsBlogEdited] = useState(false)
    const [commonError,setCommonError] = useState()
    const navigate = useNavigate()
    // let title,content;

    useEffect(()=>{
        
        const fetchBlog = async ()=>{

            try{
                const theAuthor = Author("author")
                const username = Author("username")
                const isAuthorized = await axios.post(`${url}/users/auth`,{author:theAuthor,username})
            }
            catch{
                navigate("/")
            }

            const token = Auth()
            const response = await axios.get(`${url}/blog/${id}`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setData(response.data)
            if(data){
                setTitle(data.title)
                setContent(data.content)
                setAuthor(data.author)
            }
        }

        fetchBlog()
    },[])


    const handleEdit = async ()=>{
        if(title || content){
            // console.log(title,content);
            if(title==undefined){
                setTitle(data.title)
                formData = {
                    content:content,
                    author:theAuthor,
                    username:userName
                }
            }
            else if(content==undefined){
                setContent(data.content)
                formData = {
                    title:title,
                    author:theAuthor,
                    username:userName
                }
            }else{
                formData = {
                    title:title,
                    content:content,
                    author:theAuthor,
                    username:userName
                }
            }
            // console.log(formData);

            const token = Auth()
            const response = await axios.put(`${url}/blog/${id}`,formData,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if(response){
                // console.log("Blog updated successfully");
                setIsBlogEdited(true)
                setTimeout(() => {
                    navigate("/main")
                }, 2000);
            }else{
                console.log("error");
            }

        }else{
            // console.log("Please edit");
            setCommonError("Please make any changes")
        }
    }

    if(data){
        return <>
        {isBlogEdited?
        <MessageTemplate message="Blog edited successfully!!"/>
        :
        <div className="min-h-[100vh] flex flex-col justify-between">
        <div>
        <Navbar/>
            <div className="w-screen flex justify-center items-center flex-col py-10">
                <div className="flex flex-col justify-center items-start w-[50vw]">
                    <label htmlFor="title" className="font-black text-2xl">Title</label>
                    <textarea type="text" id="title" name="title" className="border-solid border-2 border-black w-[80%]" defaultValue={data.title} onChange={(e)=>{setTitle(e.target.value)}}/>
                </div>

                <div className="flex flex-col justify-center items-start w-[50vw] pt-6">
                    <label htmlFor="content" className="font-black text-2xl">Content</label>
                    <textarea type="text" id="content" name="content" className="border-solid border-2 border-black w-[80%]" defaultValue={data.content} onChange={(e)=>{setContent(e.target.value)}}/>
                </div>

                <div className="flex flex-col justify-center items-start w-[50vw] pt-12">
                    <div className="w-[80%] flex justify-center items-center flex-col">
                        <p className="pb-3 text-red-600 font-semibold">{commonError}</p>
                        <button className="bg-purple-500 py-2 px-4 font-bold text-white text-xl rounded-md hover:text-black hover:bg-purple-600" onClick={handleEdit}>Submit</button>
                    </div>
                </div>
                
            </div>
        </div>
            <div>
                <Footer/>
            </div>
        </div>}
        </>
    }
}


export default EditBlog