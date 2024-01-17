// pages/login.js
"use client"
import Link from "next/link";
import React, { useState } from "react";
import { auth } from "../../firebase/config"; // Replace with the actual path to your AuthContext
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";

const Login = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await signInWithEmailAndPassword(
                email,
                password
            );
            console.log({ res });
            sessionStorage.setItem('user',true);
            setEmail("");
            setPassword("");
            router.replace(`/student/${res.user.uid}`);

        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div
    className="flex flex-col text-center justify-center items-center w-full h-screen bg-cover"
    style={{ backgroundImage: "url('/mainBG.png')" }}
    >
      <div className="absolute top-5 left-3 w-[26rem] h-32" style={{ backgroundImage: "url('/icon.png   ')" }}>
      </div>
      <div className="shadow-lg  h-content py-2 px-2 bg-white bg-opacity-10 rounded-3xl border border-black border-opacity-0 backdrop-blur-sm flex flex-col items-center justify-center gap-4 text-4xl font-jacques">
        <h1 className="font-bold my-4 text-6xl text-[#9A62D7]">Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 px-4 py-3 items-center">
          <input
            type="text"
            placeholder="Username"
            className=" border-2 rounded-md shadow outline-p-2none placeholder:text-2xl placeholder:text-black"
            onChange={(e)=>{setEmail(e.target.value)}}
          />
          <input
            type="password"
            placeholder="Password"
            className=" border-2 rounded-md shadow outline-p-2none placeholder:text-2xl placeholder:text-black"
            onChange = {(e)=>{setPassword(e.target.value)}}
          />
          <button
            type="submit"
            className="p-2 bg-bg text-3xl rounded-xl w-72 text-white font-bold cursor-pointer px-6 py-2"
          >
            Login
          </button>
          {error && (        <div className="flex flex-col gap-3 px-4 py-3">{error}</div>
)}
        <Link href={"/student/signup"} className="text-base w-72">
            Dont have an account? <span className="text-bg">Register here</span>.
            </Link>
            </form>

      </div>
    </div>
        // <div className="flex items-center justify-center h-screen bg-gray-900">
        //     <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        //         <h2 className="text-3xl font-semibold text-white mb-6">Log In</h2>
        //         <form onSubmit={handleSubmit}>
        //             <div className="mb-4">
        //                 <label className="block text-white text-sm font-medium mb-2">
        //                     Email
        //                 </label>
        //                 <input
        //                     type="email"
        //                     className="w-full p-3 bg-gray-700 rounded-md text-white"
        //                     placeholder="john@example.com"
        //                     value={email}
        //                     onChange={(e) => setEmail(e.target.value)}
        //                 />
        //             </div>
        //             <div className="mb-4">
        //                 <label className="block text-white text-sm font-medium mb-2">
        //                     Password
        //                 </label>
        //                 <input
        //                     type="password"
        //                     className="w-full p-3 bg-gray-700 rounded-md text-white"
        //                     placeholder="********"
        //                     value={password}
        //                     onChange={(e) => setPassword(e.target.value)}
        //                 />
        //             </div>
        //             <button
        //                 type="submit"
        //                 className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-300"
        //             >
        //                 Log In
        //             </button>
        //         </form>
        //     </div>
        // </div>
    );
};
      
export default Login;