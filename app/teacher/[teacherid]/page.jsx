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
		<div className="h-[100vh] overflow-y-hidden">
			<div className="flex justify-end pr-2 pt-4">
			<svg width="36"
					height="35" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_247_2)">
<path d="M14.9998 19C15 19.5046 14.8094 19.9906 14.4664 20.3605C14.1233 20.7305 13.653 20.9572 13.1498 20.995L12.9998 21H10.9998C10.4953 21.0002 10.0093 20.8096 9.6393 20.4665C9.26932 20.1234 9.04269 19.6532 9.00485 19.15L8.99985 19H14.9998ZM11.9998 2C13.8148 1.99997 15.5589 2.70489 16.8641 3.96607C18.1693 5.22726 18.9336 6.94609 18.9958 8.76L18.9998 9V12.764L20.8218 16.408C20.9014 16.567 20.9412 16.7429 20.9378 16.9206C20.9345 17.0984 20.8881 17.2727 20.8027 17.4286C20.7173 17.5845 20.5953 17.7174 20.4473 17.8158C20.2993 17.9143 20.1297 17.9754 19.9528 17.994L19.8378 18H4.16185C3.98401 18.0001 3.80882 17.957 3.65127 17.8745C3.49372 17.792 3.35853 17.6725 3.25727 17.5264C3.156 17.3802 3.0917 17.2116 3.06985 17.0351C3.04801 16.8586 3.06928 16.6795 3.13185 16.513L3.17785 16.408L4.99985 12.764V9C4.99985 7.14348 5.73735 5.36301 7.0501 4.05025C8.36286 2.7375 10.1433 2 11.9998 2Z" fill="black"/>
</g>
<defs>
<clipPath id="clip0_247_2">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
</svg>
                <Link href='/teacher/account'>
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
			<div className="flex justify-between mt-2 px-16">
				<div className='pt-16'>
					<div className="w-fit h-16 text-black text-5xl font-bold font-merriweather">
						Hello {docSnap?.name},
					</div>
					<div class="w-96 h-28 text-black text-base font-normal font-['Jacques Francois']">
						Schoolz provides trained, passionate tutors to support the students
						with recovery from unfinished learning,remediation and enrichment!
					</div>
                    <div className='flex flex-row justify-between'>
					<Link class="group w-40 h-14 text-black text-xl font-normal font-jacques  bg-primary rounded-2xl drop-shadow-md hover:bg-blue-600	 flex justify-center items-center gap-1"
                    href={`${params.teacherid}/createForm/`}>
						Add Course
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
								fill="black"
							/>
						</svg>
					</Link>
                    <Link class="group w-40 h-14 text-black text-xl font-normal font-jacques  bg-primary rounded-2xl drop-shadow-md hover:bg-blue-600	 flex justify-center items-center gap-1"
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
								fill="black"
							/>
						</svg>
					</Link>
                    </div>
				</div>
				<div>
					<Image
						src="/teacher.png"
						alt="Teacher Image"
						width={400}
						height={300}
					/>
				</div>
			</div>
			{/*lower part*/}
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