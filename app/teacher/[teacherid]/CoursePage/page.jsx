"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../../../firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth } from "../../../firebase/config";
import { IoNotifications } from "react-icons/io5";
import { useAuthState } from "react-firebase-hooks/auth";
import Link from "next/link";

const Page = () => {
  const [courseData, setCourseData] = useState(null);
  const router = useRouter();
  const [user] = useAuthState(auth);
  const userSession =
    typeof window !== "undefined" ? sessionStorage.getItem("user") : null;
  const [hostedCourses, setHostedCourses] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [courseReference, setCourseReference] = useState([]);
  const [updatenotify, setUpdateNotify] = useState(false);

  const handleReject = (studentId,index) => async () => {
    const courseDocRef = doc(db, "courses", courseReference[index]);
    const courseDocSnap = await getDoc(courseDocRef);
    if(courseDocSnap.exists()){
      const courseData = courseDocSnap.data();
      const pendingList = courseData.pendingStudents;
      pendingList.pop(studentId);
      await updateDoc(courseDocRef, {
        pendingStudents: pendingList,
      });
      }
    setUpdateNotify(!updatenotify);
    }
    

  const handleAccept = (studentId,index) => async () => {
    const docRef = doc(db, "students", studentId);
    const docSnap = await getDoc(docRef);
    console.log(studentId)
    console.log(index)
    if (docSnap.exists()) {
      const studentData = docSnap.data();
      const studentCourses = studentData.courses;
      studentCourses.push(courseReference[index]);
      await updateDoc(docRef, {
        courses: studentCourses,
      });
    } else {
      console.log("No such document!");
    }
    const courseDocRef = doc(db, "courses", courseReference[index]);
    const courseDocSnap = await getDoc(courseDocRef);
    if(courseDocSnap.exists()){
      const courseData = courseDocSnap.data();
      const studentList = courseData.students;
      studentList.push(studentId);
      console.log(pendingRequests)
      const pendingList = courseData.pendingStudents;
      pendingList.pop(studentId);
      await updateDoc(courseDocRef, {
        students: studentList,
        pendingStudents: pendingList,
      });
      }
    setUpdateNotify(!updatenotify);
    }

  useEffect(() => {
    const getData = async () => {
      // Check if user is authenticated
      if (user || userSession) {
        try {
          const docRef = doc(
            db,
            "teachers",
            user ? auth.currentUser.uid : userSession
          );
          const docSnap = await getDoc(docRef);

          console.log(docSnap.data().courses);

          if (docSnap.exists()) {
            const courses = docSnap.data().courses;
            const hostedCoursesData = [];

            for (const courseId of courses) {
              const courseDocSnap = await getDoc(doc(db, "courses", courseId));

              if (courseDocSnap.exists()) {
                hostedCoursesData.push(courseDocSnap.data());
              } else {
                console.log(`No course found with id: ${courseId}`);
              }
            }

            setHostedCourses(hostedCoursesData);

            // Get pending requests
            const pendingRequests = [];
            const courseReference = [];
            for(var i = 0;i<hostedCoursesData.length;i++){
              const course = hostedCoursesData[i];
              console.log(course.pendingStudents);
              for(var j = 0;j<course.pendingStudents.length;j++){
                console.log(course.pendingStudents[j])
              const pendingRequestsData = await getDoc(doc(db, "students", course.pendingStudents[j]));
              console.log(pendingRequestsData.data());
              if(pendingRequestsData.exists()){
                pendingRequests.push(pendingRequestsData.data());
                courseReference.push(course._id)
              }
            }
          }
            setPendingRequests(pendingRequests);
            setCourseReference(courseReference);
            console.log(pendingRequests);
            console.log(courseReference);

          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error getting document:", error.message);
        }
      } else {
        router.replace('/teacher/signin');
      }
    };

    getData();
  }, [user, userSession, updatenotify]);

  return (
    <div className="min-h-screen bg-gray-100 px-10 py-4">
    {/* Header */}
    <header className=" w-full bg-secondary p-4 shadow-md flex justify-between items-center">
      <div className="font-bold font-merriweather text-4xl">Course Page</div>
      <button onClick={() => setShowNotification(!showNotification)}>
      <IoNotifications className="w-10 h-10" />
      </button>
    </header>

    {/* Notifications */}
    {showNotification && (
      <div className="fixed top-17 right-4 w-96 h-96 bg-blue-300
      npm p-4 rounded-md shadow-md">
        <h2 className="text-lg font-semibold mb-2 font-merriweather">Notifications:</h2>
        {pendingRequests.map((request, index) => (
          <div key={request.email} className="mb-4 p-2 bg-white w-full flex justify-between items-center border border-gray-400">
            <div>
            <p className="text-xl">{request.name}</p>
            <Link href={`/teacher/${user.uid}/studentProfile/${request._id}`}>
              <p className=" text-blue-500 hover:underline cursor-pointer ">
                {request.email}
              </p>
            </Link>
            
            </div>
            <div>
            <button
              className="mr-2 px-4 py-2 rounded-md bg-primary text-white"
              onClick={handleAccept(request._id, index)}
            >
              Accept
            </button>
            <button
              className="px-4 py-2 rounded-md bg-gray-500 text-white"
              onClick={handleReject(request._id, index)}
            >
              Reject
            </button>
            </div>
          </div>
        ))}
      </div>
    )}

    {/* Main Content */}
    <div className="container mx-auto py-16">
      <h1 className="text-3xl font-bold mb-8">Your Courses</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {hostedCourses.map((course) => (
          <Link key={course.courseName} href={`/teacher/${user.uid}/class/${course._id}`}>
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg cursor-pointer w-96">
              <h2 className="text-xl font-semibold mb-4">{course.courseName}</h2>
              <p className="text-gray-600 mb-2">{course.studentConstraints}</p>
              <p className="text-gray-600">{course.location}</p>
              <button className="mt-4 text-white bg-primary p-2 rounded-md">View Details</button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </div>
  );
};

export default Page;
