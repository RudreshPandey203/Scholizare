// pages/login.js
"use client";
import Link from "next/link";
import React, { useState } from "react";
import { auth,db } from "../../firebase/config"; // Replace with the actual path to your AuthContext
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await signInWithEmailAndPassword(email, password);
      const docRef = doc(db, "students", res.user.uid);
      const docSnap = await getDoc(docRef);

      console.log(docSnap);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        // User is a student, proceed with login
        sessionStorage.setItem("user", JSON.stringify(res.user)); // Add user to session storage
        router.replace(`/student/${res.user.uid}`);
      } else {
        // User not found in the students table, display an error
        setError("Invalid login credentials.");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div
      className="flex flex-col text-center justify-center items-center w-full h-screen bg-cover"
      style={{ backgroundImage: "url('/bg.png')" }}
    >
      <div
        className="absolute top-5 left-3 md:w-[26rem] h-32"
        style={{ backgroundImage: "url('   ')" }}
      ></div>
      <div className="w-content md:w-[35rem] flex flex-col items-center justify-center gap-4 text-4xl font-jacques h-content  py-2 px-2 backdrop-blur-sm bg-white bg-opacity-10 rounded-3xl shadow border-4 border-black border-opacity-0">
        <h1 className="w-content font-bold my-4 text-6xl text-primary">Login</h1>
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-3 md:px-4 py-3 items-center"
        >
          <input
            type="text"
            placeholder="Username"
            className="w-full border-2 rounded-md shadow-xl outline-p-2none placeholder:text-xl placeholder:text-black px-3 py-1"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border-2 rounded-md shadow outline-p-2none placeholder:text-xl placeholder:text-black px-3 py-1"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <button
            type="submit"
            className="p-2 bg-primary shadow-xl text-3xl rounded-3xl w-72 text-white font-bold cursor-pointer px-6 py-2"
          >
            Login
          </button>
          {error && (
            <div className="text-red-500 flex flex-col gap-3 px-4 py-3">Bad Auth</div>
          )}
          <Link href={"/student/signup"} className="text-base w-72">
            Dont have an account?{" "}
            <span className="text-primary">Register here</span>.
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
