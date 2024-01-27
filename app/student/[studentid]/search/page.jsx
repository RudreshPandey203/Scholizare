"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { auth, db } from "../../../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  LoadScript,
  Autocomplete,
} from "@react-google-maps/api";

const mapContainerStyle = {
  width: "50vw",
  height: "85vh",
};

const libraries = ["places"]; // Add the "places" library

function Page({ params }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDistance, setSearchDistance] = useState(40); // Set default distance to 40 km
  const [teachers, setTeachers] = useState([]);
  const [user] = useAuthState(auth);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [center, setCenter] = useState({ lat: 80, lng: 13 });
  const [infoWindowPosition, setInfoWindowPosition] = useState(null);
  const [zoom, setZoom] = useState(14);

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
    };
    fetchTeachers();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDistanceSearch = (event) => {
    setSearchDistance(parseInt(event.target.value, 10)); // Parse to an integer
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  };

  const calculateZoom = (dmax) => {
    let degree = dmax/111/1.3;
    console.log("degree: ",degree);
    let zoom1 = Math.log2(360 / degree);
    return zoom1;
  }

  useEffect(() => {
    const updateFilteredTeachers = async () => {
      const filteredTeachersPromises = teachers.map(async (teacher) => {
        const studentData = doc(collection(db, "students"), user.uid);
        const studentDoc = await getDoc(studentData);
        const studentLatitude = studentDoc.data().latitude;
        const studentLongitude = studentDoc.data().longitude;

        console.log("student: ",studentDoc.data());

        setCenter({ lat: studentLatitude, lng: studentLongitude });

        let dmax = 0;

        const distance = calculateDistance(
          studentLatitude,
          studentLongitude,
          teacher.latitude,
          teacher.longitude
        );
          if(distance > dmax){
            dmax = distance;
          }
          let degree = dmax/111;
          console.log("degree: ",degree);
          let zoom1 = Math.log2(360 / degree);
          console.log("zoom1: ",zoom1);
          setZoom(zoom1);

        if (
          (teacher.teacherName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
            teacher.studentConstraints
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            teacher.courseName
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) &&
          (distance <= searchDistance || !searchDistance)
        ) {
          console.log("teacher: ",teacher);
          return teacher;
        }

        return null; // Return null for teachers that don't match the criteria
      });

      const filteredTeachersArray = await Promise.all(filteredTeachersPromises);
      const finalFilteredTeachers = filteredTeachersArray.filter(
        (teacher) => teacher !== null
      );
      setFilteredTeachers(finalFilteredTeachers);
    };

    updateFilteredTeachers();
  }, [teachers, user, searchTerm, searchDistance]);

  const handleMarkerClick = (position) => {
    // Set the position for the InfoWindow
    setInfoWindowPosition(position);
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search by name"
      />

      <div>
        <label>Distance Constraint:</label>
        <input
          type="range"
          min="1"
          max="100"
          value={searchDistance}
          onChange={handleDistanceSearch}
        />
        <input 
        type="number"
        value={searchDistance}
        onChange={handleDistanceSearch}
        />
      </div>

      <div className="flex flex-row">
        <div>
          {filteredTeachers &&
            filteredTeachers.map((teacher, index) => (
              <Link
                href={{
                  pathname: `/student/${params.studentid}/teacherProfile/${teacher._id}`,
                  query: {
                    teachers: teacher._id,
                  },
                }}
                key={index}
              >
                <div className="p-10 m-10 outline">
                  <h3>{teacher.teacherName}</h3>
                  <p>{teacher.courseName}</p>
                  <p>{teacher.address}</p>
                </div>
              </Link>
            ))}
        </div>
        <div>
          <LoadScript
            googleMapsApiKey={
              process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_MAPS_API_KEY
            }
            libraries={libraries}
          >
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={calculateZoom(searchDistance)}
              className="md:w-96 md:h-96 w-full"
            >
              {filteredTeachers.map((teacher, index) => (
                <Marker
                  key={index}
                  position={{ lat: teacher.latitude, lng: teacher.longitude }}
                  icon={{
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    fillColor: "red", // Set the marker color to red
                    fillOpacity: 1,
                    strokeColor: "white",
                    strokeWeight: 1,
                  }}
                  onClick={() =>
                    handleMarkerClick({
                      lat: teacher.latitude,
                      lng: teacher.longitude,
                    })
                  }
                />
              ))}

              {/* Display InfoWindow if the position is set */}
              {infoWindowPosition && (
                <InfoWindow position={infoWindowPosition}>
                  <div>
                    <h3>
                      {filteredTeachers[infoWindowPosition.index].teacherName}
                    </h3>
                    <p>
                      {filteredTeachers[infoWindowPosition.index].courseName}
                    </p>
                    <p>{filteredTeachers[infoWindowPosition.index].address}</p>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
    </div>
  );
}

export default Page;
// 'use client'
// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import { doc, getDoc , collection, getDocs } from "firebase/firestore";
// import { auth, db } from "../../../firebase/config";
// import { useAuthState } from "react-firebase-hooks/auth";

// function Page({ params }) {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchDistance, setSearchDistance] = useState(null);
//   const [teachers, setTeachers] = useState([]);
//   const [user] = useAuthState(auth);
//   const [filteredTeachers, setFilteredTeachers] = useState([]);

//   useEffect(() => {
//     const fetchTeachers = async () => {
//       try {
//         const teachersRef = collection(db, "courses");
//         const querySnapshot = await getDocs(teachersRef);
//         const teachersData = querySnapshot.docs.map((doc) => ({
//           _id: doc.id,
//           ...doc.data(),
//         }));
//         setTeachers(teachersData);
//       } catch (error) {
//         console.error("Error fetching teachers:", error.message);
//       }
//     };
//     fetchTeachers();
//   }, []);

//   const handleSearch = (event) => {
//     setSearchTerm(event.target.value);
//   };

//   const handleDistanceSearch = (event) => {
//     setSearchDistance(parseInt(event.target.value, 10)); // Parse to an integer
//   };

// const calculateDistance = (lat1, lon1, lat2, lon2) => {
//   const R = 6371; // Radius of the Earth in kilometers
//   const dLat = (lat2 - lat1) * (Math.PI / 180);
//   const dLon = (lon2 - lon1) * (Math.PI / 180);
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(lat1 * (Math.PI / 180)) *
//       Math.cos(lat2 * (Math.PI / 180)) *
//       Math.sin(dLon / 2) *
//       Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   const distance = R * c; // Distance in kilometers
//   return distance;
// };
// useEffect(() => {
//   const filteredTeachers1 = teachers.filter(async (teacher) => {

//     // Get the student's latitude and longitude from the address
//     const studentData = doc(collection(db, "students"), user.uid);
//     const studentDoc = await getDoc(studentData);;

//     const studentLatitude = studentDoc.data().latitude; /* Add logic to get student's latitude from the address */
//     const studentLongitude = studentDoc.data().longitude ; /* Add logic to get student's longitude from the address */

//     const distance = calculateDistance(
//       studentLatitude,
//       studentLongitude,
//       teacher.latitude,
//       teacher.longitude
//     );

//     console.log("distance:",teacher, distance);
//     console.log(teacher);

//     if((teacher.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         teacher.studentConstraints.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         teacher.courseName.toLowerCase().includes(searchTerm.toLowerCase())) &&
//       (distance <= searchDistance || !searchDistance)
//     ){
//       return teacher;
//     };
//   });

//   setFilteredTeachers(filteredTeachers1);

// }, [searchTerm, searchDistance]);

//   return (
//     <div>
//       <input
//         type="text"
//         value={searchTerm}
//         onChange={handleSearch}
//         placeholder="Search by name"
//       />

//       {/* Slider for distance constraint */}
//       <div>
//         <label>Distance Constraint: {searchDistance} kilometers</label>
//         <input
//           type="range"
//           min="0"
//           max="100" // Set your maximum distance in kilometers as needed
//           value={searchDistance}
//           onChange={handleDistanceSearch}
//         />
//       </div>

//       <div>
//         {filteredTeachers && filteredTeachers.map((teacher, index) => (
//           <Link
//             href={{
//               pathname: `/studentLogin/${params.student}/teacherProfile/${teacher._id}`,
//               query: {
//                 teachers: teacher._id,
//               },
//             }}
//             key={index}
//           >
//             <div className="p-10 m-10 outline">
//               <h3>{teacher.teacherName}</h3>
//               <p>{teacher.courseName}</p>
//               <p>{teacher.address}</p>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Page;

// // 'use client'
// // import React, { useEffect, useState } from "react";
// // import Link from "next/link";
// // import { collection, getDocs } from "firebase/firestore";
// // import { auth, db } from "../../../firebase/config";
// // import { useAuthState } from "react-firebase-hooks/auth";

// // function Page({ params }) {
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [searchDistance, setSearchDistance] = useState(null);
// //   const [teachers, setTeachers] = useState([]);
// //   const [user] = useAuthState(auth);

// //   useEffect(() => {
// //     const fetchTeachers = async () => {
// //       try {
// //         const teachersRef = collection(db, "courses");
// //         const querySnapshot = await getDocs(teachersRef);
// //         const teachersData = querySnapshot.docs.map((doc) => ({
// //           _id: doc.id,
// //           ...doc.data(),
// //         }));
// //         setTeachers(teachersData);
// //       } catch (error) {
// //         console.error("Error fetching teachers:", error.message);
// //       }
// //     };
// //     fetchTeachers();
// //   }, []);

// //   const handleSearch = (event) => {
// //     setSearchTerm(event.target.value);
// //   };

// //   const handleDistanceSearch = (event) => {
// //     setSearchDistance(parseInt(event.target.value, 10)); // Parse to an integer
// //   };

// //   const filteredPeople = teachers.filter(
// //     (person) =>
// //       (person.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //         person.studentConstraints.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //         person.courseName.toLowerCase().includes(searchTerm.toLowerCase())) &&
// //       (person.distance <= searchDistance || !searchDistance)
// //   );

// //   return (
// //     <div>
// //       <input
// //         type="text"
// //         value={searchTerm}
// //         onChange={handleSearch}
// //         placeholder="Search by name"
// //       />

// //       {/* Slider for distance constraint */}
// //       <div>
// //         <label>Distance Constraint: {searchDistance} miles</label>
// //         <input
// //           type="range"
// //           min="0"
// //           max="10" // Set your maximum distance as needed
// //           value={searchDistance}
// //           onChange={handleDistanceSearch}
// //         />
// //       </div>

// //       <div>
// //         {filteredPeople.map((person, index) => (
// //           <Link
// //             href={{
// //               pathname: `/studentLogin/${params.student}/teacherProfile/${person._id}`,
// //               query: {
// //                 teachers: person._id,
// //               },
// //             }}
// //             key={index}
// //           >
// //             <div className="p-10 m-10 outline">
// //               <h3>{person.teacherName}</h3>
// //               <p>{person.courseName}</p>
// //               <p>{person.address}</p>
// //             </div>
// //           </Link>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }

// // export default Page;

// // // "use client";
// // // import React, { useEffect, useState } from "react";
// // // import Link from "next/link";
// // // import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
// // // import {auth, db} from "../../../firebase/config";
// // // import { useAuthState } from "react-firebase-hooks/auth";

// // // function page({params}){
// // //   const [searchTerm, setSearchTerm] = useState("");
// // //   const [searchDistance, setSearchDistance] = useState(null);
// // //   const [teachers, setTeachers] = useState([]);
// // //   const [user] = useAuthState(auth);

// // //   useEffect(() => {

// // //     const fetchTeachers = async () => {
// // //       try {
// // //         const teachersRef = collection(db, "courses");
// // //         const querySnapshot = await getDocs(teachersRef);
// // //         const teachersData = querySnapshot.docs.map((doc) => ({
// // //           _id: doc.id,
// // //           ...doc.data(),
// // //         }));
// // //         setTeachers(teachersData);
// // //       } catch (error) {
// // //         console.error("Error fetching teachers:", error.message);
// // //       }
// // //     }
// // //     fetchTeachers();

// // //   }, []);

// // //   const handleSearch = (event) => {
// // //     setSearchTerm(event.target.value);
// // //   };

// // //   const handleDistanceSearch = (event) => {
// // //     setSearchDistance(parseInt(event.target.value, 10)); // Parse to an integer
// // //   };
// // //   const filteredPeople = teachers.filter(
// // //     (person) =>
// // //       (person.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) || person.studentConstraints.toLowerCase().includes(searchTerm.toLowerCase()) || person.courseName.toLowerCase().includes(searchTerm.toLowerCase())) &&
// // //       (person.distance <= searchDistance || !searchDistance)
// // //   );
// // //   return (
// // //     <div>
// // //       <input
// // //         type="text"
// // //         value={searchTerm}
// // //         onChange={handleSearch}
// // //         placeholder="Search by name"
// // //       />
// // //       <input
// // //         type="number"
// // //         onChange={handleDistanceSearch}
// // //         placeholder="Filter by distance"
// // //       />
// // //       <div>
// // //         {filteredPeople.map((person, index) => (
// // //           <Link
// // //             href={{
// // //               pathname: `/studentLogin/${params.student}/teacherProfile/${person._id}`,
// // //               query: {
// // //                 teachers: person._id,
// // //               },
// // //             }}
// // //             key={index}
// // //           >
// // //             <div className="p-10 m-10 outline">
// // //               <h3>{person.teacherName}</h3>
// // //               <p>{person.courseName}</p>
// // //               <p>{person.address}</p>
// // //             </div>
// // //           </Link>
// // //         ))}
// // //       </div>
// // //     </div>
// // //   );
// // // }
// // // export default page;

// // // // // Import necessary modules and libraries
// // // // 'use client'
// // // // import React, { useState, useEffect } from 'react';
// // // // import { useRouter } from 'next/navigation';
// // // // import { auth } from '@/app/firebase/config';
// // // // import { useAuthState } from 'react-firebase-hooks/auth';
// // // // import { getDocs, collection } from 'firebase/firestore';
// // // // import { db } from '@/app/firebase/config';

// // // // const Page = () => {
// // // //   const router = useRouter();
// // // //   const [user] = useAuthState(auth);
// // // //   const userSession = sessionStorage.getItem('user');

// // // //   const [courses, setCourses] = useState([]);

// // // //   useEffect(() => {
// // // //     const fetchCourses = async () => {
// // // //       try {
// // // //         // Get a reference to the 'courses' collection
// // // //         const coursesRef = collection(db, 'courses');

// // // //         // Fetch all documents from the 'courses' collection
// // // //         const querySnapshot = await getDocs(coursesRef);

// // // //         console.log('querySnapshot:', querySnapshot);

// // // //         // Extract data from each document
// // // //         const coursesData = querySnapshot.docs.map((doc) => ({
// // // //           id: doc.id,
// // // //           ...doc.data(),
// // // //         }));

// // // //         // Update state with the fetched courses
// // // //         setCourses(coursesData);

// // // //         console.log('coursesData:', coursesData);
// // // //       } catch (error) {
// // // //         console.error('Error fetching courses:', error.message);
// // // //       }
// // // //     };

// // // //     // Call the fetchCourses function
// // // //     fetchCourses();
// // // //   }, []);

// // // //   return (
// // // //     <div>
// // // //       <h1>All Courses</h1>
// // // //       <div className="course-container">
// // // //         {courses && courses.map((course) => (
// // // //           <div key={course.id} className="m-5 p-5 bg-blue-400">
// // // //             <h3>{course.courseName}</h3>
// // // //             <p>{course.fees}</p>
// // // //           </div>
// // // //         ))}
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default Page;
