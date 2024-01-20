// Import necessary modules and libraries
'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/app/firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '@/app/firebase/config';

const Page = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const userSession = sessionStorage.getItem('user');

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Get a reference to the 'courses' collection
        const coursesRef = collection(db, 'courses');

        // Fetch all documents from the 'courses' collection
        const querySnapshot = await getDocs(coursesRef);

        console.log('querySnapshot:', querySnapshot);

        // Extract data from each document
        const coursesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Update state with the fetched courses
        setCourses(coursesData);

        console.log('coursesData:', coursesData);
      } catch (error) {
        console.error('Error fetching courses:', error.message);
      }
    };

    // Call the fetchCourses function
    fetchCourses();
  }, []);

  return (
    <div>
      <h1>All Courses</h1>
      <div className="course-container">
        {courses && courses.map((course) => (
          <div key={course.id} className="m-5 p-5 bg-blue-400">
            <h3>{course.courseName}</h3>
            <p>{course.fees}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
