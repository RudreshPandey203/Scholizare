"use client";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState, useEffect } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../../../../../firebase/config";
import { set } from "lodash";

function page({ params }) {
  const [user] = useAuthState(auth);
  const userSession =
    typeof window !== "undefined" ? sessionStorage.getItem("user") : null;

  const [teacher, setTeacher] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (user) {
      getDoc(doc(db, "teachers", params.teacherId)).then((doc) => {
        if (doc.exists()) {
          setTeacher(doc.data());
        }
      });
      if (teacher) {
        // console.log("hello")
        // for(var i = 0;i<teacher.courses.length;i++){
        //     console.log(teacher.courses[i])
        //     getDoc(doc(db, "courses", teacher.courses[i])).then((doc) => {
        //         if (doc.exists()) {
        //             setCourses((prevCourses) => [...prevCourses, doc.data()]);
        //         }
        //     });
        // }
      }
      console.log(courses);
    }
  }, [user]);

  console.log(courses);

  useEffect(() => {
    if (teacher != null) {
      console.log("hello", teacher.courses);
      var temp = [];
      for (var i = 0; i < teacher.courses.length; i++) {
        console.log(teacher.courses[i]);
        getDoc(doc(db, "courses", teacher.courses[i])).then((doc) => {
          if (doc.exists()) {
            temp.push(doc.data());
          }
        });
      }
      console.log("outside temp ", temp);
      setCourses(temp);
    }
  }, [teacher, user]);
  return (
    <div>
      {teacher && (
        <div>
          <div className="flex m-4 ">
            <div>
              <img
                className="h-64 rounded-full w-64"
                src={teacher.profilepic}
              ></img>
            </div>
            <div className="p-10 h-64 flex flex-col justify-evenly">
              <h1 className="text-3xl font-bold">{teacher.name}</h1>
              <h2>{teacher.email}</h2>
              <h3>{teacher.phone}</h3>
            </div>
          </div>
          {courses && (
            <div className="h-48">
                {courses.map((course) => (
                    <div>
                        <h1>{course.courseName}</h1>
                    </div>
                ))
                }
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default page;
