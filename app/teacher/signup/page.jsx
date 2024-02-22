// pages/signup.js
"use client";
import Link from 'next/link';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/config';
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import {doc , setDoc} from 'firebase/firestore';
import {db} from '../../firebase/config';

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all elements are filled
    if (!name || !email || !password) {
      setError("Please fill all the fields");
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(email, password);
      sessionStorage.setItem('user', true);
      console.log({ res });
      await setDoc(doc(db, "teachers", res.user.uid), {
        _id: res.user.uid,
        name,
        email,
        role: "teacher",
        address: "",
        city: "",
        state: "",
        pincode: "",
        location: "",
        className: "",
        school: "",
        profilepic: "/user.png",
        dob: "",
        phone: "",
        courses: [],
      });
      setName("");
      setEmail("");
      setPassword("");
      router.replace("/teacher/signin");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col text-center justify-center items-center w-full h-screen bg-cover" style={{ backgroundImage: "url('/classroom.png')" }}>
      <div className="absolute top-5 left-3 w-[26rem] h-32" style={{ backgroundImage: "url(' ')" }}>
      </div>
    <div className="w-content md:w-[35rem]  shadow-lg  h-content py-2 px-2 bg-white bg-opacity-10 rounded-3xl border border-black border-opacity-0 backdrop-blur-sm flex flex-col items-center justify-center gap-4 text-4xl font-jacques">
      <h1 className="w-content  font-bold my-4 text-6xl text-primary">Register</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:px-4  pt-2 items-center">
            <input
                type="text"
                placeholder="Full Name"
                className="border-2 rounded-md shadow outline-p-2none placeholder:text-xl placeholder:text-black px-3 py-1 w-full"
                onChange={(e) => setName(e.target.value)}
            />
          <input
            type="text"
            placeholder="Email"
            className="border-2 rounded-md shadow outline-p-2none placeholder:text-xl placeholder:text-black px-3 py-1 w-full"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border-2 rounded-md shadow outline-p-2none placeholder:text-xl placeholder:text-black px-3 py-1 w-full"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="p-2 bg-primary text-3xl rounded-3xl w-72 text-white font-bold cursor-pointer px-6 py-2 hover:bg-blue-600"
          >
            Register
          </button>
        </form>
{       error && ( <div className="flex flex-col gap-3 px-4 py-3">{error}</div>)
}        <Link href="/teacher/signin" className='text-base  w-72'>
            Already have an account? <span className='text-primary'>Login</span>
            </Link>
      </div>
    </div>
    // <div className="flex items-center justify-center h-screen bg-gray-900">
    //   <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
    //     <h2 className="text-3xl font-semibold text-white mb-6">Sign Up</h2>
    //     <form onSubmit={handleSubmit}>
    //       <div className="mb-4">
    //         <label className="block text-white text-sm font-medium mb-2">
    //           Full Name
    //         </label>
    //         <input
    //           type="text"
    //           className="w-full p-3 bg-gray-700 rounded-md text-white"
    //           placeholder="John Doe"
    //           value={name}
    //           onChange={(e) => setName(e.target.value)}
    //         />
    //       </div>
    //       <div className="mb-4">
    //         <label className="block text-white text-sm font-medium mb-2">
    //           Email
    //         </label>
    //         <input
    //           type="email"
    //           className="w-full p-3 bg-gray-700 rounded-md text-white"
    //           placeholder="john@example.com"
    //           value={email}
    //           onChange={(e) => setEmail(e.target.value)}
    //         />
    //       </div>
    //       <div className="mb-4">
    //         <label className="block text-white text-sm font-medium mb-2">
    //           Password
    //         </label>
    //         <input
    //           type="password"
    //           className="w-full p-3 bg-gray-700 rounded-md text-white"
    //           placeholder="********"
    //           value={password}
    //           onChange={(e) => setPassword(e.target.value)}
    //         />
    //       </div>
    //       <button
    //         type="submit"
    //         className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-300"
    //       >
    //         Sign Up
    //       </button>
    //     </form>
    //     {error && <div className="text-red-500 mt-4">{error}</div>}
    //   </div>
    // </div>
  );
};

export default Signup;

// // pages/signup.js
// "use client"
// import {useCreateUserWithEmailAndPassword} from 'react-firebase-hooks/auth';
// import {auth} from '../../firebase/config'
// import React, { useState } from "react";
// import {useRouter} from 'next/navigation'

// const Signup = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
//   const router = useRouter();

//   const handleSubmit = async(e) => {
//     e.preventDefault();
//     try{
//         const res = await createUserWithEmailAndPassword( email, password);
//         sessionStorage.setItem('user',true);
//         console.log({res});
//         setEmail("");
//         setPassword("");
//         router.replace("/teacher/signin");
//     }
//     catch(err){
//         setError(err.message);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center h-screen bg-gray-900">
//       <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
//         <h2 className="text-3xl font-semibold text-white mb-6">Sign Up</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-white text-sm font-medium mb-2">
//               Full Name
//             </label>
//             <input
//               type="text"
//               className="w-full p-3 bg-gray-700 rounded-md text-white"
//               placeholder="John Doe"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-white text-sm font-medium mb-2">
//               Email
//             </label>
//             <input
//               type="email"
//               className="w-full p-3 bg-gray-700 rounded-md text-white"
//               placeholder="john@example.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-white text-sm font-medium mb-2">
//               Password
//             </label>
//             <input
//               type="password"
//               className="w-full p-3 bg-gray-700 rounded-md text-white"
//               placeholder="********"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-300"
//           >
//             Sign Up
//           </button>
//         </form>
//         {error && <div className="text-red-500 mt-4">{error}</div>}
//       </div>
//     </div>
//   );
// };

// export default Signup;
