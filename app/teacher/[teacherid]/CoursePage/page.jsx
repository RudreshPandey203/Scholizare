"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../../../firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth } from "../../../firebase/config";
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
    <div>
      <div className="fixed top-0 w-full flex justify-end">
        <button onClick={() => setShowNotification(!showNotification)}>
          notify
        </button>
        {showNotification && (
        //   <div className="absolute top-8 right-0 w-96 h-96 bg-slate-300">
        //   Notification:
        //   <br />
        //   {pendingRequests.length > 0 && (
        //     <ul>
        //       {pendingRequests.forEach((request, index) => (
        //         <li key={request.email}>
        //           <Link href={`/teacher/${user.uid}/studentProfile/${request._id}`}>
        //             <p>{request.email}</p>
        //             <p>{request.name}</p>
        //           </Link>
        //           <button onClick={() => handleAccept(request._id)}>Accept</button>
        //           <button onClick={() => handleReject(request._id)}>Reject</button>
        //         </li>
        //       ))}
        //     </ul>
        //   )}
        // </div>
          <div className="absolute top-8 right-0 w-96 h-96 bg-slate-300">
            Notification:
            <br/>
            {pendingRequests.map((request,index) => (
              <div key={request.email}>
                <Link href={`/teacher/${user.uid}/studentProfile/${request._id}`}><p>{request.email}</p>
                <p>{request.name}</p></Link>
                <button className="p-2 rounded-md bg-blue-600" onClick={handleAccept(request._id,index)}>Accept</button>
                <button className="p-2 rounded-md bg-blue-600"
                 onClick={handleReject(request._id,index)}
                 >Reject</button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        Course Page
        <br />
        {hostedCourses.map((course) => (
          <Link
            className="block m-5 p-5 bg-slate-400"
            key={course.courseName}
            href={`class/${course._id}`}
          >
            <h3>{course.courseName}</h3>
            <p>{course.studentConstraints}</p>
            <p>{course.location}</p>
            <p>{course.fees}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Page;
