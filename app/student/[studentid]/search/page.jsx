'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../../../firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
	GoogleMap,
	Marker,
	InfoWindow,
	LoadScript,
	Autocomplete,
} from '@react-google-maps/api';

const mapContainerStyle = {
	width: '45vw',
	height: '80vh',
};

const libraries = ['places']; // Add the "places" library

function Page({ params }) {
	const [searchTerm, setSearchTerm] = useState('');
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
				const teachersRef = collection(db, 'courses');
				const querySnapshot = await getDocs(teachersRef);
				const teachersData = querySnapshot.docs.map((doc) => ({
					_id: doc.id,
					...doc.data(),
				}));
				setTeachers(teachersData);
			} catch (error) {
				console.error('Error fetching teachers:', error.message);
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
		let degree = dmax / 111 / 1.3;
		console.log('degree: ', degree);
		let zoom1 = Math.log2(360 / degree);
		return zoom1;
	};

	useEffect(() => {
		const updateFilteredTeachers = async () => {
			const filteredTeachersPromises = teachers.map(async (teacher) => {
				const studentData = doc(collection(db, 'students'), user.uid);
				const studentDoc = await getDoc(studentData);
				const studentLatitude = studentDoc.data().latitude;
				const studentLongitude = studentDoc.data().longitude;

				console.log('student: ', studentDoc.data());

				setCenter({ lat: studentLatitude, lng: studentLongitude });

				let dmax = 0;

				const distance = calculateDistance(
					studentLatitude,
					studentLongitude,
					teacher.latitude,
					teacher.longitude
				);
				if (distance > dmax) {
					dmax = distance;
				}
				let degree = dmax / 111;
				console.log('degree: ', degree);
				let zoom1 = Math.log2(360 / degree);
				console.log('zoom1: ', zoom1);
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
					console.log('teacher: ', teacher);
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
		<div className="bg-white h-screen w-full flex p-4 gap-3">
			{/*Sidebar*/}
			<div className="flex flex-col items-center justify-normal gap-40 bg-secondary w-80 h-full pt-6 rounded-3xl">
				<img className=" w-48 h-16" src="/icon.png"></img>
				<div className="flex flex-col justify-between h-72">
					<div className="flex w-52 ease-out duration-500 transition-all h-content cursor-pointer justify-between text-black text-2xl font-medium font-jacques bg-primary active:bg-primary hover:bg-primary rounded-md p-2 border-2 border-secondary">
						<p>Dashboard</p>
						<div className="p-2">
							<svg
								width="18"
								height="18"
								viewBox="0 0 18 18"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									id="Vector"
									d="M0 10H8V0H0V10ZM0 18H8V12H0V18ZM10 18H18V8H10V18ZM10 0V6H18V0H10Z"
									fill="black"
								/>
							</svg>
						</div>
					</div>
					<div className="flex active:bg-primary hover:bg-primary font-medium rounded-md px-1 py-2 border-2 border-secondary w-52 ease-out duration-500 transition-all h-content cursor-pointer justify-between text-black text-2xl  font-jacques">
						<p>Video Summary</p>
						<div className="p-2">
							<svg
								width="18"
								height="12"
								viewBox="0 0 18 12"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M14 4.5V1C14 0.734784 13.8946 0.48043 13.7071 0.292893C13.5196 0.105357 13.2652 0 13 0H1C0.734784 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1V11C0 11.2652 0.105357 11.5196 0.292893 11.7071C0.48043 11.8946 0.734784 12 1 12H13C13.2652 12 13.5196 11.8946 13.7071 11.7071C13.8946 11.5196 14 11.2652 14 11V7.5L18 11.5V0.5L14 4.5Z"
									fill="black"
								/>
							</svg>
						</div>
					</div>
					<Link
						className="flex active:bg-primary hover:bg-primary rounded-md p-2 border-2 border-secondary w-52 ease-out duration-500 transition-all h-content cursor-pointer justify-between text-black text-2xl font-medium font-jacques  "
						href={`/student/${params.studentid}/search`}
					>
						<p>Search Tuitions</p>
						<div className="p-2">
							<svg
								width="20"
								height="20"
								viewBox="0 0 20 20"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M19 19L13 13M1 8C1 8.91925 1.18106 9.82951 1.53284 10.6788C1.88463 11.5281 2.40024 12.2997 3.05025 12.9497C3.70026 13.5998 4.47194 14.1154 5.32122 14.4672C6.1705 14.8189 7.08075 15 8 15C8.91925 15 9.82951 14.8189 10.6788 14.4672C11.5281 14.1154 12.2997 13.5998 12.9497 12.9497C13.5998 12.2997 14.1154 11.5281 14.4672 10.6788C14.8189 9.82951 15 8.91925 15 8C15 7.08075 14.8189 6.1705 14.4672 5.32122C14.1154 4.47194 13.5998 3.70026 12.9497 3.05025C12.2997 2.40024 11.5281 1.88463 10.6788 1.53284C9.82951 1.18106 8.91925 1 8 1C7.08075 1 6.1705 1.18106 5.32122 1.53284C4.47194 1.88463 3.70026 2.40024 3.05025 3.05025C2.40024 3.70026 1.88463 4.47194 1.53284 5.32122C1.18106 6.1705 1 7.08075 1 8Z"
									stroke="black"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						</div>
					</Link>
					<div className="flex active:bg-primary hover:bg-primary rounded-md p-2 border-2 border-secondary w-52 ease-out duration-500 transition-all h-content cursor-pointer justify-between text-black text-2xl font-medium font-jacques  ">
						<p>Solve Doubts</p>
						<div className="p-2">
							<svg
								width="22"
								height="18"
								viewBox="0 0 22 18"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M11 0L0 6L4 8.18V14.18L11 18L18 14.18V8.18L20 7.09V14H22V6L11 0ZM17.82 6L11 9.72L4.18 6L11 2.28L17.82 6ZM16 13L11 15.72L6 13V9.27L11 12L16 9.27V13Z"
									fill="black"
								/>
							</svg>
						</div>
					</div>
					<div className="flex active:bg-primary hover:bg-primary rounded-md p-2 border-2 border-secondary w-52 ease-out duration-500 transition-all h-content cursor-pointer justify-between text-black text-2xl font-medium font-jacques  ">
						<p>Wellness</p>
						<div className="p-2">
							<svg
								width="19"
								height="20"
								viewBox="0 0 19 20"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M8.00081 4.02965e-08C9.94337 0.000126694 11.8195 0.706882 13.2794 1.98843C14.7392 3.26999 15.6831 5.03882 15.9348 6.965L18.1848 10.504C18.3328 10.737 18.3028 11.084 17.9598 11.232L16.0008 12.07V15C16.0008 15.5304 15.7901 16.0391 15.415 16.4142C15.0399 16.7893 14.5312 17 14.0008 17H12.0018L12.0008 20H3.00081V16.306C3.00081 15.126 2.56481 14.009 1.75581 13.001C0.81351 11.8245 0.222786 10.4056 0.0517001 8.908C-0.119386 7.41036 0.136127 5.89486 0.788798 4.53611C1.44147 3.17737 2.46474 2.03066 3.74071 1.22811C5.01668 0.425571 6.49343 -0.000151226 8.00081 4.02965e-08ZM7.47081 5.763C7.14082 5.44416 6.6988 5.26768 6.23995 5.27157C5.78111 5.27546 5.34215 5.45942 5.01762 5.78382C4.69309 6.10822 4.50896 6.5471 4.50488 7.00595C4.5008 7.46479 4.6771 7.90688 4.99581 8.237L8.00081 11.243L11.0058 8.237C11.1729 8.07553 11.3062 7.8824 11.3979 7.66888C11.4895 7.45535 11.5378 7.22571 11.5397 6.99334C11.5417 6.76098 11.4974 6.53055 11.4094 6.3155C11.3213 6.10045 11.1913 5.90509 11.027 5.74081C10.8626 5.57653 10.6672 5.44662 10.4521 5.35868C10.2371 5.27073 10.0066 5.2265 9.77425 5.22856C9.54188 5.23063 9.31226 5.27895 9.09877 5.37071C8.88528 5.46247 8.6922 5.59582 8.53081 5.763L8.00081 6.293L7.47081 5.763Z"
									fill="black"
								/>
							</svg>
						</div>
					</div>
				</div>
			</div>
			<div className="w-full">
				<div className="w-full flex bg-secondary justify-between items-center px-3 py-2 rounded-2xl ">
					<form>
						<div class="relative">
							<div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none ">
								<svg
									class="w-4 h-4 text-gray-500 "
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 20 20"
								>
									<path
										stroke="currentColor"
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
									/>
								</svg>
							</div>
							<input
								type="text"
								value={searchTerm}
								onChange={handleSearch}
								class="block w-full p-4 ps-10 text-sm text-gray-900 border-2 border-gray-300 rounded-lg bg-gray-50 focus:border-primary focus:outline-none focus:bg-white"
								placeholder="Search by Name"
							/>
						</div>
					</form>

					{/* <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search by name"
      /> */}
					<div className="w-content h-full  p-1 border-2 border-gray-300 bg-gray-50 rounded-lg">
						<input
							type="number"
							value={searchDistance}
							onChange={handleDistanceSearch}
							className="w-10 h-10  text-base placeholder-gray-600 text-center rounded-lg  focus:border-primary focus:outline-none"
						/>
						<label>Filter by Distance:</label>
						<input
							type="range"
							min="1"
							max="100"
							value={searchDistance}
							onChange={handleDistanceSearch}
						/>
					</div>
				</div>
				<div className="flex flex-row items-center justify-between w-full">
					<div className="">
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
									<div className="m-4 rounded-lg border-2 py-4 px-2">
                    <div className='w-full flex justify-center h-12'>
										<Image
											src="/user.png"
											width={500}
											height={500}
											alt="Picture"
                      className='h-20 w-20 rounded-full absolute border-4 border-white'
										/>
                    </div>
                    <div className='bg-secondary px-4 pt-10 flex flex-col items-center justify-center font-jacques shadow-sm'>
										<div className='text-2xl font-semibold'>{teacher.teacherName}</div>
										<div className='text-xl font-medium'>{teacher.courseName}</div>
										<div>{teacher.address}</div>
                    </div>
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
											scale: 10,
											fillColor: 'red', // Set the marker color to red
											fillOpacity: 1,
											strokeColor: 'white',
											strokeWeight: 2,
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
											<p>
												{filteredTeachers[infoWindowPosition.index].address}
											</p>
										</div>
									</InfoWindow>
								)}
							</GoogleMap>
						</LoadScript>
					</div>
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
