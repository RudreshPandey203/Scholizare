"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import {auth, db} from "../../../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";

function page({params}){
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDistance, setSearchDistance] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [user] = useAuthState(auth);

  useEffect(() => {

    const fetchTeachers = async () => {
      try {
        const teachersRef = collection(db, "courses");
        const querySnapshot = await getDocs(teachersRef);
        const teachersData = querySnapshot.docs.map((doc) => ({
          _id: doc.id,
          ...doc.data(),
        }));
        setTeachers(teachersData);
      } catch (error) {
        console.error("Error fetching teachers:", error.message);
      }
    }
    fetchTeachers();
    
  }, []);



  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDistanceSearch = (event) => {
    setSearchDistance(parseInt(event.target.value, 10)); // Parse to an integer
  };
  const filteredPeople = teachers.filter(
    (person) =>
      (person.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) || person.studentConstraints.toLowerCase().includes(searchTerm.toLowerCase()) || person.courseName.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (person.distance <= searchDistance || !searchDistance)
  );
  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search by name"
      />
      <input
        type="number"
        onChange={handleDistanceSearch}
        placeholder="Filter by distance"
      />
      <div>
        {filteredPeople.map((person, index) => (
          <Link
            href={{
              pathname: `/studentLogin/${params.student}/teacherProfile/${person._id}`,
              query: {
                teachers: person._id,
              },
            }}
            key={index}
          >
            <div className="p-10 m-10 outline">
              <h3>{person.name}</h3>
              <p>{person.subject}</p>
              <p>{person.address}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
export default page;

// // Import necessary modules and libraries
// 'use client'
// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { auth } from '@/app/firebase/config';
// import { useAuthState } from 'react-firebase-hooks/auth';
// import { getDocs, collection } from 'firebase/firestore';
// import { db } from '@/app/firebase/config';

// const Page = () => {
//   const router = useRouter();
//   const [user] = useAuthState(auth);
//   const userSession = sessionStorage.getItem('user');

//   const [courses, setCourses] = useState([]);

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         // Get a reference to the 'courses' collection
//         const coursesRef = collection(db, 'courses');

//         // Fetch all documents from the 'courses' collection
//         const querySnapshot = await getDocs(coursesRef);

//         console.log('querySnapshot:', querySnapshot);

//         // Extract data from each document
//         const coursesData = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));

//         // Update state with the fetched courses
//         setCourses(coursesData);

//         console.log('coursesData:', coursesData);
//       } catch (error) {
//         console.error('Error fetching courses:', error.message);
//       }
//     };

//     // Call the fetchCourses function
//     fetchCourses();
//   }, []);

//   return (
//     <div>
//       <h1>All Courses</h1>
//       <div className="course-container">
//         {courses && courses.map((course) => (
//           <div key={course.id} className="m-5 p-5 bg-blue-400">
//             <h3>{course.courseName}</h3>
//             <p>{course.fees}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Page;
