'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { auth } from '@/app/firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db } from '@/app/firebase/config';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
function Page({params}) {

	const [user, loading, error] = useAuthState(auth);
	const [userData, setUserData] = useState(null);
	const [userDoc, setUserDoc] = useState(null);
	const router = useRouter();
	useEffect(() => {
		const fetechUserData = async () => {
			if (user) {
				const userRef = doc(db, 'students', user.uid);
				const userDoc = await getDoc(userRef);
				setUserDoc(userDoc.data());
			}
		};
		fetechUserData();
	}, [user]);

			

	console.log(userDoc);


	const responsive = {
		superLargeDesktop: {
			// the naming can be any, depends on you.
			breakpoint: { max: 4000, min: 3000 },
			items: 5,
		},
		desktop: {
			breakpoint: { max: 3000, min: 1024 },
			items: 3,
		},
		tablet: {
			breakpoint: { max: 1024, min: 464 },
			items: 2,
		},
		mobile: {
			breakpoint: { max: 464, min: 0 },
			items: 1,
		},
	};
	const carouselData = [
		{
			imageAddress: '/Rectangle 7.png',
			name: 'Shreya Singh',
			description: 'Description 1',
			userid: 'khan',
		},
    {
			imageAddress: '/alakh.webp',
			name: 'Alakh Pandey',
			description: 'Description 2',
			userid: 'pw',
		},
    {
			imageAddress: '/shraddha.webp',
			name: 'Shraddha Khapra',
			description: 'Description 3',
			userid: 'aman',
		},
		{
			imageAddress:'/Rectangle 7.png',
			name: 'Shreya Singh',
			description: 'Description 1',
			userid: 'khan',
		},
		{
			imageAddress: '/Rectangle 7.png',
			name: 'Shreya Singh',
			description: 'Description 1',
			userid: 'khan',
		},
		{
			imageAddress: '/Rectangle 7.png',
			name: 'Shreya Singh',
			description: 'Description 1',
			userid: 'khan',
		},
		
		{
			imageAddress: '/Rectangle 7.png',
			name: 'Shraddha Khapra',
			description: 'Description 3',
			userid: 'aman',
		},
		
	];
	return (
		<div className="bg-primary h-screen w-full flex">
			{/*Sidebar*/}
			<div className="flex flex-col items-center justify-between bg-white w-80 h-screen pt-6 ">
				<img
					className=" w-48 h-16 "
					src='/icon.png'
				></img>
				<div className="flex flex-col justify-between h-72	">
					<div className="flex w-52 h-content cursor-pointer justify-between text-black text-2xl font-normal font-jacques bg-primary p-1">
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
					<div className="flex w-52 h-content cursor-pointer justify-between text-black text-2xl font-normal font-jacques hover:bg-primary p-1 ">
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
					<Link className="flex w-52 h-content cursor-pointer justify-between text-black text-2xl font-normal font-jacques hover:bg-primary p-1 "
					href={`/student/${params.studentid}/search`}>
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
					<div className="flex w-52 h-content cursor-pointer justify-between text-black text-2xl font-normal font-jacques hover:bg-primary p-1 ">
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
					<div className="flex w-52 h-content cursor-pointer justify-between text-black text-2xl font-normal font-jacques hover:bg-primary p-1 ">
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
				<div
					className="h-28"
					style={{ backgroundImage: "url('/sidebar.png')" }}
				></div>
			</div>
			{/*Main Page*/}
			<div className="p-2 w-full flex-col gap-4">
				<div className="flex justify-end">
					<Link 
						href={{
							pathname: '/student/account',
						}}>
					<svg
						width="34"
						height="33"
						viewBox="0 0 54 53"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<g clip-path="url(#clip0_44_99)">
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M27 4.41675C14.5733 4.41675 4.5 14.3035 4.5 26.5001C4.5 38.6967 14.5733 48.5834 27 48.5834C39.4268 48.5834 49.5 38.6967 49.5 26.5001C49.5 14.3035 39.4268 4.41675 27 4.41675ZM19.125 20.9792C19.125 19.9642 19.3287 18.9592 19.7244 18.0214C20.1202 17.0837 20.7003 16.2316 21.4315 15.5139C22.1628 14.7962 23.0309 14.2269 23.9864 13.8384C24.9418 13.45 25.9658 13.2501 27 13.2501C28.0342 13.2501 29.0582 13.45 30.0136 13.8384C30.9691 14.2269 31.8372 14.7962 32.5685 15.5139C33.2997 16.2316 33.8798 17.0837 34.2756 18.0214C34.6713 18.9592 34.875 19.9642 34.875 20.9792C34.875 23.0292 34.0453 24.9951 32.5685 26.4446C31.0916 27.8941 29.0886 28.7084 27 28.7084C24.9114 28.7084 22.9084 27.8941 21.4315 26.4446C19.9547 24.9951 19.125 23.0292 19.125 20.9792ZM41.0805 37.5064C39.3962 39.5858 37.2551 41.2649 34.8169 42.4182C32.3787 43.5715 29.7066 44.1692 27 44.1667C24.2934 44.1692 21.6213 43.5715 19.1831 42.4182C16.7449 41.2649 14.6038 39.5858 12.9195 37.5064C16.5668 34.9381 21.5438 33.1251 27 33.1251C32.4562 33.1251 37.4333 34.9381 41.0805 37.5064Z"
								fill="black"
							/>
						</g>
						<defs>
							<clipPath id="clip0_44_99">
								<rect width="54" height="53" fill="white" />
							</clipPath>
						</defs>
					</svg>
					</Link>
				</div>
				{/*Motto*/}
				<div className="w-content h-content bg-white rounded-[3rem] mt-2 pt-14  flex flex-col gap-12 ">
					<div className="flex justify-between pr-24 pl-4 w-full">
						<div className="w-96 text-black text-5xl font-extrabold font-merriweather">
							District-wide,<br></br>In-Person & Online Tutoring Services
						</div>
						<div className="w-96 h-36 text-black text-lg font-normal font-jacques pr-4 pt-4">
							Schoolz provides trained, passionate tutors to support the
							students with recovery from unfinished learning,remediation and
							enrichment!
							<div>
								<button className="w-36 h-11 bg-secondary rounded-2xl flex justify-center items-center gap-4">
									Find Tutor
									<svg
										width="12"
										height="10"
										viewBox="0 0 12 10"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M5.72661 0.21934C5.86876 0.0788896 6.06145 0 6.26235 0C6.46325 0 6.65594 0.0788896 6.79809 0.21934L11.0941 4.46934C11.2361 4.60997 11.3158 4.80059 11.3158 4.99934C11.3158 5.19809 11.2361 5.38871 11.0941 5.52934L6.79809 9.77934C6.65429 9.91175 6.4642 9.98385 6.26778 9.9805C6.07136 9.97714 5.8839 9.89858 5.74481 9.76134C5.60608 9.62374 5.52668 9.43829 5.52328 9.24397C5.51989 9.04965 5.59277 8.8616 5.72661 8.71934L8.72876 5.74934L1.20824 5.74934C1.00717 5.74934 0.814342 5.67032 0.672169 5.52967C0.529994 5.38902 0.450121 5.19825 0.450121 4.99934C0.450121 4.80043 0.529994 4.60966 0.672169 4.46901C0.814342 4.32836 1.00717 4.24934 1.20824 4.24934L8.72876 4.24934L5.72661 1.27934C5.58464 1.13871 5.5049 0.948091 5.5049 0.74934C5.5049 0.550589 5.58464 0.359965 5.72661 0.21934Z"
											fill="black"
										/>
									</svg>
								</button>
							</div>
						</div>
					</div>
          <div className="flex">
						<div className="w-96 h-36 bg-[#D6C0F2] rounded-tr-[3rem] rounded-bl-[3rem]"></div>
						<div className="w-36 h-36 bg-violet-200 rounded-full"></div>
						<div>
							<img
								src="/kid.jpeg"
								alt=""
								className="w-80 h-36 rounded-tr-3xl"
							/>
						</div>
						<div className="w-96 h-36 bg-purple-300 rounded-tl-[3rem] rounded-bl-[3rem] rounded-br-[3rem]"></div>
            <div className="w-24 h-36 bg-violet-200 rounded-full"></div>
					</div>
					{/* <div className="flex ">
						<div className="w-[28rem] h-36 bg-[#D6C0F2] rounded-tr-[3rem] rounded-bl-[3rem]"></div>
						<div className="w-36 h-36 bg-violet-200 rounded-full"></div>
						<div>
							<img
								src=""
								alt=""
								className="w-80 h-36 rounded-tr-3xl border border-violet-500"
							/>
						</div>
						<div className="w-80 h-36 bg-purple-300 rounded-tl-[3rem] rounded-bl-[3rem] rounded-br-[3rem]"></div>
					</div> */}
				</div>
				{/* enrolled carousel */}
				<div className="flex flex-col ">
					<div className='text-3xl font-jacques'>Registered Courses:</div>
					<div className='w-[80vw]'>
						<Carousel
							className="p-10 h-content"
							swipeable={true}
							draggable={true}
							responsive={responsive}
							infinite={false}
							autoPlaySpeed={100}
							keyBoardControl={true}
							containerClass="carousel-container"
							removeArrowOnDeviceType={['tablet', 'mobile']}
							dotListClass="custom-dot-list-style"
							itemClass="carousel-item-padding-40-px"
						>
							{carouselData.map((item, index) => (
								<Link
									href={{
										pathname: '/student/class/',
										query: {
											teacherid: item.userid,
											teachername: item.name,
										},
									}}
									key={index}
								>
									<div className="flex flex-col justify-center gap-1 items-center hover:scale-105 transition duration-300 ease-in-out text-black text-2xl font-normal font-jacques rounded-2xl bg-white w-44 h-content shadow border border-black border-opacity-50">
										<Image
											src={item.imageAddress}
											alt={item.name}
											className="w-44 h-40 rounded-tl-2xl rounded-tr-2xl"
											width={200}
											height={200}
										/>
										<p className="">{item.name}</p>
										<p className="text-black text-lg font-normal font-jacques">
											{item.description}
										</p>
									</div>
								</Link>
							))}
						</Carousel>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Page;

// "use client"
// import Link from 'next/link'
// import React from 'react'
// import Image from 'next/image'


// const page = ({params}) => {
//   console.log(params.student)
//   const carouselData = [
//     {
//     }]
//   const presenturl = `/student/${params.student}`
//   return (
//       <main className="">
//       {/* student navbar */}
//       <div className="flex bg-[#c6f0f5] justify-end p-4">
//         <Link href={{
//           pathname:`/student/account`,
//           }}className="">
//           Account
//         </Link>
//       </div>
//       {/* enrolled carousel */}
//       {carouselData.length > 0 && (
//       <div className="flex flex-row items-center h-[40vh] overflow-y-hidden ">
//         {carouselData.map((item, index) => (
//           <Link
//             href={{
//               pathname: `${presenturl}/${item.id}`,
//               query: {course: JSON.stringify(item)
//               },
//             }}
//             key={index}
//           >
//             <div className="flex flex-col p-10 items-center hover:scale-105 transition duration-300 ease-in-out bg-red-200 px-10 mx-10">
//               <Image
//                 src={item.imageAddress}
//                 alt={item.name}
//                 className="rounded-full cursor-pointer w-auto h-auto"
//                 width={200}
//                 height={200}
//               />
//               <p>{item.name}</p>
//               <p>{item.description}</p>
//             </div>
//           </Link>
//         ))}
//       </div>
//       )}
//       {/* video analyser */}
//       <Link href={`${presenturl}/checkyoulearn`}>
//         <button className="bg-[#fff888] p-10 m-5 items-center hover:scale-105 transition duration-300 ease-in-out">
//           Video Analyzer
//         </button>
//       </Link>
//       {/* searchbar */}
//       <Link href={`${presenturl}/search`}>
//         <button className="bg-[#fff888] p-10 m-5 items-center hover:scale-105 transition duration-300 ease-in-out">
//           Search Tuitions
//         </button>
//       </Link>
//       {/* doubt solver chatbot */}
//       <Link href={`${presenturl}/doubtsolve`}>
//         <button className="bg-[#fff888] p-10 m-5 items-center hover:scale-105 transition duration-300 ease-in-out">
//           Solve your doubts
//         </button>
//       </Link>
//       <Link href="/student/account" className='text-blue-500'>Account</Link>
//     </main>
//   )
// }

// export default page
