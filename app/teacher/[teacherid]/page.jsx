'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { auth } from '@/app/firebase/config';
import { getDoc, doc, collection, Timestamp } from 'firebase/firestore';
import { db } from '@/app/firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';

function page({params}) {
	const router = useRouter();
	const [user] = useAuthState(auth);


	const userSession =
    typeof window !== "undefined" ? sessionStorage.getItem("user") : null;
	const [docSnap, setDocSnap] = useState(null);


	const currentDate = new Date();

const options = {
  weekday: 'long',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hour12: true,
};

const formattedDate = currentDate.toLocaleString('en-US', options);

console.log(formattedDate);

	useEffect(()=>{
		const fetchUserData = async () =>{
			if(user && userSession){
				const teacherRef = doc(collection(db, 'teachers'), user.uid);
				const teacherDocSnap = await getDoc(teacherRef);
				setDocSnap(teacherDocSnap.data());
			}
		}
		fetchUserData();
	},[user, userSession])

	console.log("teacher data = ",docSnap);
	
	return (
		<div className="h-screen px-4 pt-10 md:pt-0  flex flex-col justify-center">
			<div className="flex justify-end pr-2 item-start ">
                <Link className='p-2' href='/teacher/account'>
				<svg
					width="36"
					height="35"
					viewBox="0 0 46 45"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M23 0.416748C10.5733 0.416748 0.5 10.3035 0.5 22.5001C0.5 34.6967 10.5733 44.5834 23 44.5834C35.4268 44.5834 45.5 34.6967 45.5 22.5001C45.5 10.3035 35.4268 0.416748 23 0.416748ZM15.125 16.9792C15.125 15.9642 15.3287 14.9592 15.7244 14.0214C16.1202 13.0837 16.7003 12.2316 17.4315 11.5139C18.1628 10.7962 19.0309 10.2269 19.9864 9.83843C20.9418 9.45 21.9658 9.25008 23 9.25008C24.0342 9.25008 25.0582 9.45 26.0136 9.83843C26.9691 10.2269 27.8372 10.7962 28.5685 11.5139C29.2997 12.2316 29.8798 13.0837 30.2756 14.0214C30.6713 14.9592 30.875 15.9642 30.875 16.9792C30.875 19.0292 30.0453 20.9951 28.5685 22.4446C27.0916 23.8941 25.0886 24.7084 23 24.7084C20.9114 24.7084 18.9084 23.8941 17.4315 22.4446C15.9547 20.9951 15.125 19.0292 15.125 16.9792ZM37.0805 33.5064C35.3962 35.5858 33.2551 37.2649 30.8169 38.4182C28.3787 39.5715 25.7066 40.1692 23 40.1667C20.2934 40.1692 17.6213 39.5715 15.1831 38.4182C12.7449 37.2649 10.6038 35.5858 8.9195 33.5064C12.5668 30.9381 17.5438 29.1251 23 29.1251C28.4562 29.1251 33.4333 30.9381 37.0805 33.5064Z"
						fill="black"
					/>
				</svg>

                </Link>
				
			</div>
			<div className='flex flex-col'>
			<div className="flex justify-between gap-6 md:gap-0 mt-6 md:px-20 bg-secondary py-4 rounded-xl p-4 h-fit w-fit xl:w-full">
				<div className='pt-16'>
					<div className="w-fit h-fit text-black text-5xl md:text-5xl font-bold font-merriweather">
						Hello {docSnap?.name},
					</div>
					<div class="w-96 h-28 text-black text-base font-normal font-['Jacques Francois']">
						Schoolz provides trained, passionate tutors to support the students
						with recovery from unfinished learning,remediation and enrichment!
					</div>
                    <div className='flex flex-row justify-between'>
					<Link class="group w-40 h-14 text-white text-xl font-normal font-jacques  bg-primary rounded-2xl drop-shadow-md hover:bg-blue-600 flex justify-center items-center gap-1"
                    href={`${params.teacherid}/createForm/`}>
						Add Course
						<svg
							className="group-hover:rotate-90 ease-in-out duration-500"
							width="11"
							height="10"
							viewBox="0 0 11 10"
							fill="white"
							xmlns="http://www.w3.org/2000/svg"
							
						>
							<path
								d="M5.27654 0.21934C5.41869 0.0788896 5.61138 0 5.81228 0C6.01318 0 6.20587 0.0788896 6.34801 0.21934L10.644 4.46934C10.786 4.60997 10.8657 4.80059 10.8657 4.99934C10.8657 5.19809 10.786 5.38871 10.644 5.52934L6.34801 9.77934C6.20421 9.91175 6.01412 9.98385 5.8177 9.9805C5.62128 9.97714 5.43383 9.89858 5.29474 9.76134C5.15601 9.62374 5.0766 9.43829 5.07321 9.24397C5.06982 9.04965 5.1427 8.8616 5.27654 8.71934L8.27868 5.74934L0.758164 5.74934C0.557099 5.74934 0.36427 5.67032 0.222095 5.52967C0.0799208 5.38902 4.76837e-05 5.19825 4.76837e-05 4.99934C4.76837e-05 4.80043 0.0799208 4.60966 0.222095 4.46901C0.36427 4.32836 0.557099 4.24934 0.758164 4.24934L8.27868 4.24934L5.27654 1.27934C5.13457 1.13871 5.05483 0.948091 5.05483 0.74934C5.05483 0.550589 5.13457 0.359965 5.27654 0.21934Z"
								fill="white"
							/>
						</svg>
					</Link>
                    
                    </div>
				</div>
				<div className='hidden md:block'>
					<Image
						src="/teacher.png"
						alt="Teacher Image"
						width={400}
						height={300}
					/>
				</div>
			</div>
			{/*lower part*/}
			<div className='flex gap-2 flex-wrap md:flex-nowrap'>
				<div className='flex  justify-between md:pl-20 pl-4  md:gap-0 mt-6  bg-secondary py-4 rounded-xl  h-fit w-full xl:w-1/2'>
					<div className='text-5xl font-bold font-merriweather '>View Courses
					<div class="w-96 h-28 text-black text-base font-normal font-['Jacques Francois'] mt-4">
						Schoolz provides trained, passionate tutors to support the students
						with recovery from unfinished learning,remediation and enrichment!
					</div>
					<Link class="group w-40 h-14 text-white text-xl font-normal font-jacques  bg-primary rounded-2xl drop-shadow-md hover:bg-blue-600	 flex justify-center items-center gap-1"
                    href={`${params.teacherid}/CoursePage/`}>
						View Courses
						<svg
							className="group-hover:rotate-90 ease-in-out duration-500"
							width="11"
							height="10"
							viewBox="0 0 11 10"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M5.27654 0.21934C5.41869 0.0788896 5.61138 0 5.81228 0C6.01318 0 6.20587 0.0788896 6.34801 0.21934L10.644 4.46934C10.786 4.60997 10.8657 4.80059 10.8657 4.99934C10.8657 5.19809 10.786 5.38871 10.644 5.52934L6.34801 9.77934C6.20421 9.91175 6.01412 9.98385 5.8177 9.9805C5.62128 9.97714 5.43383 9.89858 5.29474 9.76134C5.15601 9.62374 5.0766 9.43829 5.07321 9.24397C5.06982 9.04965 5.1427 8.8616 5.27654 8.71934L8.27868 5.74934L0.758164 5.74934C0.557099 5.74934 0.36427 5.67032 0.222095 5.52967C0.0799208 5.38902 4.76837e-05 5.19825 4.76837e-05 4.99934C4.76837e-05 4.80043 0.0799208 4.60966 0.222095 4.46901C0.36427 4.32836 0.557099 4.24934 0.758164 4.24934L8.27868 4.24934L5.27654 1.27934C5.13457 1.13871 5.05483 0.948091 5.05483 0.74934C5.05483 0.550589 5.13457 0.359965 5.27654 0.21934Z"
								fill="white"
							/>
						</svg>
					</Link>
					</div>
					<div className='hidden md:block'>
					<Image
						src="/group.png"
						alt="Teacher Image"
						width={500}
						height={500}
						className='w-full h-full'
					/>
					</div>
				</div>
				<div className='flex  justify-between md:pl-20 pl-4  md:gap-0 mt-6  bg-secondary py-4 rounded-xl  h-fit w-full  xl:w-1/2'>
					<div className='text-5xl font-bold font-merriweather '>Check Schedule
					<div class="w-96 h-28 text-black text-base font-normal font-['Jacques Francois'] mt-4">
						Schoolz provides trained, passionate tutors to support the students
						with recovery from unfinished learning,remediation and enrichment!
					</div>
					<Link class="group w-40 h-14 text-white text-xl font-normal font-jacques  bg-primary rounded-2xl drop-shadow-md hover:bg-blue-600	 flex justify-center items-center gap-1"
					href={`calendar1/`}
                    >
						Check Calender
						<svg
							className="group-hover:rotate-90 ease-in-out duration-500"
							width="11"
							height="10"
							viewBox="0 0 11 10"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M5.27654 0.21934C5.41869 0.0788896 5.61138 0 5.81228 0C6.01318 0 6.20587 0.0788896 6.34801 0.21934L10.644 4.46934C10.786 4.60997 10.8657 4.80059 10.8657 4.99934C10.8657 5.19809 10.786 5.38871 10.644 5.52934L6.34801 9.77934C6.20421 9.91175 6.01412 9.98385 5.8177 9.9805C5.62128 9.97714 5.43383 9.89858 5.29474 9.76134C5.15601 9.62374 5.0766 9.43829 5.07321 9.24397C5.06982 9.04965 5.1427 8.8616 5.27654 8.71934L8.27868 5.74934L0.758164 5.74934C0.557099 5.74934 0.36427 5.67032 0.222095 5.52967C0.0799208 5.38902 4.76837e-05 5.19825 4.76837e-05 4.99934C4.76837e-05 4.80043 0.0799208 4.60966 0.222095 4.46901C0.36427 4.32836 0.557099 4.24934 0.758164 4.24934L8.27868 4.24934L5.27654 1.27934C5.13457 1.13871 5.05483 0.948091 5.05483 0.74934C5.05483 0.550589 5.13457 0.359965 5.27654 0.21934Z"
								fill="white"
							/>
						</svg>
					</Link>
					</div>
					<div className='hidden md:block'>
					<Image
						src="/tab.png"
						alt="Teacher Image"
						width={500}
						height={500}
						className='w-full h-full'
					/>
					</div>
				</div>
				</div>
				
			</div>

			{/* <div className='w-screen h-full bg-blue-200 flex py-10 mt-3 justify-evenly'>
			<div class="w-72 h-80 bg-white rounded-2xl flex flex-col justify-center items-center gap-1 group cursor-pointer hover:scale-105 ease-in-out duration-300"><Image
						src="/calen.png"
						alt="Teacher Image"
						width={400}
						height={300}
					/>
					<div class="w-72 h-16 flex justify-center  text-black text-3xl font-normal font-jacques ">Check Schedule</div>
					</div>
			<div class="w-72 h-80 bg-white rounded-2xl flex flex-col group gap-1 cursor-pointer hover:scale-105 ease-in-out duration-300"><Image
						src="/clock.png"
						alt="Teacher Image"
						width={400}
						height={300}
					/>
					<div class="w-72 h-16 flex justify-center  text-black text-3xl font-normal font-jacques">Upcoming Classes</div>
					</div>
			<div class="w-72 h-80 bg-white rounded-2xl flex flex-col group gap-1 cursor-pointer hover:scale-105 ease-in-out duration-300"><Image
						src="/class.png"
						alt="Teacher Image"
						width={400}
						height={300}
						
					/>
					<div class="w-72 h-16 flex justify-center  text-black text-3xl font-normal font-jacques">Online Class</div>
					</div>
			</div> */}
		</div>
	);
}

export default page;