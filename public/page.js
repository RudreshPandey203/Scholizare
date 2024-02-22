'use client';
import Link from 'next/link';
import Image from 'next/image';
import { TypeAnimation } from 'react-type-animation';
export default function Home() {
	return (
		<div>
			<nav className="xl:px-16 px-2 py-3 flex xl:justify-between  items-center drop-shadow-xl border-b-2 flex-wrap">
				<div className=" text-7xl text-primary/50 ">Scholizare</div>
				<Link href="/teacher/signin/">
					<button className="rounded-lg font-semibold text-lg w-60 drop-shadow-lg h-16 btn relative inline-flex items-center justify-start overflow-hidden transition-all bg-primary  hover:bg-primary group">
						{/* purple box */}
						<span className="w-0 h-0 rounded-lg bg-white absolute top-0 left-0 ease-out duration-500 transition-all group-hover:w-full group-hover:h-full -z-1"></span>
						<span className="w-full text-white transition-colors duration-300 ease-in-out group-hover:text-primary z-10">
							Join as Teacher
						</span>
					</button>
				</Link>
			</nav>
			<main className="flex md:justify-between justify-center items-center xl:px-16  pb-8 flex-wrap-reverse ">
				<div className="flex flex-col justify-center py-8 ">
					<div className="text-2xl font-normal font-jacques ">Welcome to</div>
					<div className="text-6xl  font-jacques ">Scholizare</div>
					<div className="text-2xl  font-jacques ">
						<TypeAnimation
							sequence={['Your next door learning destination', 10]}
							speed={5}
							style={{ fontSize: '1.5rem' }}
							repeat={Infinity}
						/>
					</div>
					<div>
						<Link
							className="relative inline-flex items-center justify-center overflow-hidden transition-all bg-primary  hover:bg-primary group mt-8  w-60 h-16 rounded-lg text-white font-semibold text-lg drop-shadow-lg duration-300 ease-in-out gap-2"
							href="/student/signin/"
						>
							<span className="w-0 h-0 rounded-lg bg-white absolute top-0 left-0 ease-out duration-500 transition-all group-hover:w-full group-hover:h-full -z-1"></span>
						<span className=" inline-flex items-center justify-center gap-2 w-full text-white transition-colors duration-300 ease-in-out group-hover:text-primary  z-10">
							Join as Student
							<svg
							className='group-hover:fill-primary'
								width="11"
								height="10"
								viewBox="0 0 11 10"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M5.27654 0.21934C5.41869 0.0788896 5.61138 0 5.81228 0C6.01318 0 6.20587 0.0788896 6.34801 0.21934L10.644 4.46934C10.786 4.60997 10.8657 4.80059 10.8657 4.99934C10.8657 5.19809 10.786 5.38871 10.644 5.52934L6.34801 9.77934C6.20421 9.91175 6.01412 9.98385 5.8177 9.9805C5.62128 9.97714 5.43383 9.89858 5.29474 9.76134C5.15601 9.62374 5.0766 9.43829 5.07321 9.24397C5.06982 9.04965 5.1427 8.8616 5.27654 8.71934L8.27868 5.74934L0.758164 5.74934C0.557099 5.74934 0.36427 5.67032 0.222095 5.52967C0.079921 5.38902 4.76837e-05 5.19825 4.76837e-05 4.99934C4.76837e-05 4.80043 0.079921 4.60966 0.222095 4.46901C0.36427 4.32836 0.557099 4.24934 0.758164 4.24934L8.27868 4.24934L5.27654 1.27934C5.13457 1.13871 5.05483 0.948091 5.05483 0.74934C5.05483 0.550589 5.13457 0.359965 5.27654 0.21934Z"
									fill="white"
								/>
							</svg>
							</span>
						</Link>
					</div>
				</div>
				<div className="">
					<Image
						src="/main.png"
						alt="Teacher Image"
						width={440}
						height={390}
					></Image>
				</div>
			</main>
			<div className="flex justify-evenly h-content flex-wrap">
				<div class="w-72 h-content bg-[#E8E8E8]/30  shadow-md rounded-2xl flex flex-col justify-center items-center gap-1 group cursor-pointer hover:scale-105 ease-in-out duration-300">
					<Image
						src="/first.png"
						alt="Teacher Image"
						width={400}
						height={300}
					/>
					<div class="w-72 h-16 flex justify-center  text-black text-3xl font-normal font-jacques ">
						Solve Doubts
					</div>
				</div>
				<div class="w-72 h-content bg-[#E8E8E8]/30  shadow-md rounded-2xl flex flex-col justify-center items-center gap-1 group cursor-pointer hover:scale-105 ease-in-out duration-300">
					<Image
						src="/second.png"
						alt="Teacher Image"
						width={400}
						height={300}
					/>
					<div class="w-72 h-16 flex justify-center  text-black text-3xl font-normal font-jacques">
						Nearest Tuitions
					</div>
				</div>
				<div class="w-72 h-content bg-[#E8E8E8]/30  shadow-md rounded-2xl flex flex-col justify-center items-center gap-1 group cursor-pointer hover:scale-105 ease-in-out duration-300">
					<Image
						src="/third.png"
						alt="Teacher Image"
						width={400}
						height={300}
					/>
					<div class="w-72 h-16 flex justify-center  text-black text-3xl font-normal font-jacques">
						Online Class
					</div>
				</div>
			</div>
		</div>
	);
}
{/*shinig hover 
<div className="h-full group flex justify-center items-center relative overflow-hidden">
        <h2>Hover over me</h2>

        <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
      </div>*/}
