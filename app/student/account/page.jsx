'use client'
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
// import { auth } from '../../firebase/config';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';

import { useState, useEffect } from 'react';
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
// // import { db } from '../../firebase/config';
// import firebase from 'firebase/app'; // Import the firebase module
import { auth, db } from '../../firebase/config';

const page = () => {
    const router = useRouter();
    const [user] = useAuthState(auth);
    const userSession = sessionStorage.getItem("user");
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [formData, setFormData] = useState({
        dob:'',
        phone:'',
        profilepic:'',
        address:'',
        city:'',
        state:'',
        pincode:'',
        location:'',
        className:'',
        school:'',
      });

    //picture update
    const picChange = (e) => {
        console.log(e.target.name)
        console.log("profile pic")
        console.log(e);
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = function () {
          console.log("profile pic base 64: ",reader.result);
          setFormData({ ...formData, [e.target.name]: reader.result });
        };
        reader.onerror = function (error) {
          console.log('Error: ', error);
        };
      }

      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    //handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Update the database in Firebase
            console.log(formData)
            await updateDoc(doc(db, 'students', user.uid), {
                dob: formData.dob,
                phone: formData.phone,
                profilepic: formData.profilepic,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
                location: formData.location,
                className: formData.className,
                school: formData.school,
              });
        

            console.log('Data updated successfully!');
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            if (user && userSession) {
                const studentRef = doc(collection(db, 'students'), user.uid);
                const studentSnapshot = await getDoc(studentRef);
                if (studentSnapshot.exists()) {
                    const studentData = studentSnapshot.data();
                    setEmail(studentData.email);
                    setName(studentData.name);
                    setFormData(studentData);
                }
            }
        };

        fetchUserData();
    }, [user, userSession]);

    if (!user && !userSession) {
        router.replace("/student/signup");
    }

    return (
        <div>
            <h1>Email: {email}</h1>
            <h1>Name: {name}</h1>
            {formData.profilepic && <img className='w-40 h-40 border-spacing-3 rounded-full' src={formData.profilepic} alt="profile pic" />}
   
      <form className="flex flex-col text-center p-10 outline-dashed m-10 w-60" onSubmit={handleSubmit}>
        <label>
          DOB:
          <input
            type="date" // Update the input type to "date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            autoComplete="bday"
          />
        </label>
        <br />
        <label>
          Phone:
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            autoComplete="phone"
          />
        </label>
        <br />
        <label>
          Profile Picture:
          <input
            accept='image/*'
            type="file"
            name="profilepic"
            onChange={picChange}
            autoComplete="profilepic"
          />
        </label>
        <br />
        <label>
          Address:
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            autoComplete="address"
          />
        </label>
        <br />
        <label>
          City:
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            autoComplete="city"
          />
        </label>
        <br />
        <label>
          State:
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            autoComplete="state"
          />
        </label>
        <br />
        <label>
          Pincode:
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            autoComplete="pincode"
          />
        </label>
        <br />
        <label>
          Location:
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            autoComplete="location"
          />
        </label>
        <br />
        <label>
          Class:
          <input
            type="text"
            name="className"
            value={formData.className}
            onChange={handleChange}
            autoComplete="className"
          />
        </label>
        <br />
        <label>
          School:
          <input
            type="text"
            name="school"
            value={formData.school}
            onChange={handleChange}
            autoComplete="school"
          />
        </label>
        <br />
        <button
          className="bg-red-400 bg-blend-screen text-center"
          type="submit"
          >Submit</button>
      </form>
            <button className='bg-black text-blue-50' onClick={() => {
                signOut(auth);
                sessionStorage.removeItem('user');
            }}>Log Out</button>
        </div>
    );
};

export default page
