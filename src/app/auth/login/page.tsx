"use client"
import { useCallback, useState } from "react";
import  Input  from "../../../components/Input";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { ChangeEvent } from 'react'



const Auth=()=>{
    const router = useRouter()
    const [email,setEmail] =useState("")
    const [name,setName]=useState("")
    const [password,setPassword] = useState("")
    const [variant,setVariant]=useState("login")
    const toggleVariant =useCallback(()=>{
        setVariant((currentVariant)=> currentVariant==="login"?"register":"login")
    },[]);
    const login = useCallback(async () => {
        try {
            const response = await signIn("credentials", {
                email,
                password,
                redirect: false, // 必要であればここをfalseにして、手動でリダイレクトを制御
                callbackUrl: "/", // サインイン後にリダイレクトされるURL
            });
            if (response?.ok) {
                // リダイレクトする
                router.push("/profile");
            } else {
                console.error("Login failed", response?.error);
            }
        } catch (error) {
            console.log(error);
        }
    }, [email, password, router]);
   

    
    // const register =useCallback(async()=>{
    //     try{
    //         await axios.post("/api/auth/register",{email,name,password});
    //         router.push("/profile");
    //     }catch(error){
    //         console.log(error);
    //     }

    // },[email,name,password,router])
    const register = useCallback(async () => {
        try {
          const response = await axios.post("/api/auth/register", { email, name, password });
          // 注册成功后调用 NextAuth 登录
          if (response.status === 201) {
            const signInResponse = await signIn("credentials", {
              email,
              password,
              
              callbackUrl: "/profile", // 登录后跳转的页面
            });
            if (signInResponse?.ok) {
              router.push("/profile");
            } else {
              console.error("Login after registration failed", signInResponse?.error);
            }
          }
        } catch (error) {
          console.log(error);
        }
      }, [email, name, password, router]);
    
    return(
        <div className="relative h-full w-full bg-[url('/change-netflix-region.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
            {/* <div className="bg-black h-full w-full lg:bg-opacity-50"> */}
                <nav className="px-12 py-5">
                    <img src="/Netflix_Logo_RGB.png" alt="logo" className="h-12"/>
                    <div className="flex justify-center">
                        <div className="bg-black bg-opacity-70 px-16 py-16 self-center mt-2 lg:w-2/5 lg:max-w-md rounded-md w-full">
                            <h2 className="text-white text-4xl mb-8 font-semibold">
                                {variant==="login"?"Sign in":"Register"}
                            </h2>
                            <div className="flex flex-col gap-4">
                                {variant==="register"&&(
                                    <Input
                                    label="Username"
                                    onChange={(e: ChangeEvent<HTMLInputElement>)=>setName(e.target.value)}
                                    id="name"
                                    value={name}/>
                                )}
                                <Input
                                label="Email"
                                onChange={(e: ChangeEvent<HTMLInputElement>)=>setEmail(e.target.value)}
                                id="email"
                                type="email"
                                value={email}/>
                                <Input
                                label="Password"
                                onChange={(e: ChangeEvent<HTMLInputElement>)=>setPassword(e.target.value)}
                                id="password"
                                type="password"
                                value={password}/>
                            </div>
                            <button  onClick={variant==="login"?login:register} className="bg-red-600 py-3 text-white rounded-md w-full mt-10 hover:bg-red-700 transition">
                                {variant==="login"?"Login":"Sign up"}
                            </button>
                            <div className="flex flex-row items-center gap-4 mt-8 justify-center">
                                <div onClick={()=>{signIn("google",{callbackUrl:"/profile"})}}  
                                className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition">
                                    <FcGoogle size={30}/>
                                </div>
                                <div onClick={()=>{signIn("github",{callbackUrl:"/"})}} 
                                className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition">
                                    <FaGithub size={30}/>
                                </div>

                            </div>
                            <p className="text-neutral-500 mt-12">
                                {variant==="login"?"First time using Netflix?":"Already have an account?"}
                                <span onClick={toggleVariant} className="text-white ml-1 hover:underline cursor-pointer">
                                    {variant==="login"?"Create an account":"Login"}
                                </span>
                            </p>
                        </div>
                    </div>
                </nav>
            {/* </div> */}
        </div>
    )
}
export default Auth;
