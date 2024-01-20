// components/RegisterCourseForm.js
'use client'
import React,{useState, useEffect} from 'react';
import { auth } from '@/app/firebase/config';
import { db } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import {doc, getDoc , setDoc, updateDoc} from 'firebase/firestore';


const RegisterCourseForm = () => {

  const [form, setForm] = useState({
    courseName: "",
    studentConstraints: "",
    location: "",
    fees: "",
  });

  const [error, setError] = useState("");
  const router = useRouter();

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // Check if all elements are filled
  //   if (!form.courseName || !form.studentConstraints || !form.location || !form.fees) {
  //     setError("Please fill all the fields");
  //     return;
  //   }
  //   alert("hello")
  //   try{

  //     const teacherData = await getDoc(doc(db, "teachers", auth.currentUser.uid));
  //     const teachers = teacherData.data();
  //     const courses = teacherCourses.courses;
  //     console.log({teachers})


  //     const res = await setDoc(doc(db, "courses", form.courseName), {
  //       courseName: form.courseName,
  //       studentConstraints: form.studentConstraints,
  //       location: form.location,
  //       fees: form.fees,
  //     });
  //     console.log({ res });
  //     setForm({
  //       courseName: "",
  //       studentConstraints: "",
  //       location: "",
  //       fees: "",
  //     });
  //   }
  //   catch(err){
  //     setError(err.message);
  //   }

  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check if all elements are filled
    if (!form.courseName || !form.studentConstraints || !form.location || !form.fees) {
      setError("Please fill all the fields");
      return;
    }
  
    try {
      const teacherData = await getDoc(doc(db, "teachers", auth.currentUser.uid));
      const teachers = teacherData.data();
      console.log({ teachers });

      // Check if teachers and courses are defined
      const courses = teachers && teachers.courses ? teachers.courses : [];

      console.log({ courses });

      // Check if course already exists
      if (courses.some(course => course.toLowerCase() === form.courseName.toLowerCase())) {
        setError("Course already exists");
        console.log("already exists");
        return;
      }

      const courseid = teachers._id + form.courseName;

      // Update courses array
      courses.push(courseid);

      console.log({ courses });

      // Update courses array in teachers collection
      await updateDoc(doc(db, 'teachers', teachers._id), {
        courses,
      });

      console.log("works");

      // const courseid = teachers._id + form.courseName;

      // Update courses collection
      await setDoc(doc(db, "courses", courseid), {
        teacherName: teachers.name,
        teacherId: teachers._id,
        _id : courseid,
        courseName: form.courseName,
        studentConstraints: form.studentConstraints,
        location: form.location,
        fees: form.fees,
      });
      console.log("works");
      setForm({
        courseName: "",
        studentConstraints: "",
        location: "",
        fees: "",
      });

      alert("Course Registered Successfully");

      router.replace(`/teacher/${teachers._id}`);
    } catch (err) {
      setError(err.message);
    }
  };
  

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 m-[5vh] bg-blue-500 rounded-md h-[90vh]">
      <h2 className="text-2xl text-white font-semibold mb-6">Register for a Course</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="courseName" className="block text-white text-sm font-medium mb-2">
            Course Name
          </label>
          <input
            type="text"
            id="courseName"
            name="courseName"
            value={form.courseName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-300"
            placeholder="Enter the course name"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="studentConstraints" className="block text-white text-sm font-medium mb-2">
            Student Constraints
          </label>
          <input
            type="text"
            id="studentConstraints"
            name="studentConstraints"
            value={form.studentConstraints}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-300"
            placeholder="Enter student constraints"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="location" className="block text-white text-sm font-medium mb-2">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-300"
            placeholder="Enter the location"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="fees" className="block text-white text-sm font-medium mb-2">
            Fees
          </label>
          <input
            type="text"
            id="fees"
            name="fees"
            value={form.fees}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-300"
            placeholder="Enter the fees"
          />
        </div>

        <button
          type="submit"
          className="bg-white text-blue-500 px-4 py-2 rounded-md hover:bg-blue-200 focus:outline-none"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterCourseForm;
