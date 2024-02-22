'use client'
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase/config';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';

const page = () => {
    const router = useRouter();
    const [user] = useAuthState(auth);
    const userSession = sessionStorage.getItem("user");
    console.log(userSession)
    console.log(user);
    if(!user && !userSession){
        router.replace("/student/signup");
    }

  return (
    <div>
        <button onClick={()=> {signOut(auth)
        sessionStorage.removeItem('user')}}>Log Out</button>
    </div>
  )
}

export default page
