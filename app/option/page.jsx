import React from 'react';
import Link from 'next/link';
function page() {
	return (
		<main
			className="flex flex-col text-center justify-center items-center w-full h-screen bg-cover"
			style={{ backgroundImage: "url('/mainBG.png')" }}
		>
			<div
				className="absolute top-5 left-3 w-[26rem] h-32 "
				style={{ backgroundImage: "url('/icon.png   ')" }}
			></div>
			<div className="w-96 h-96 px-2 bg-white bg-opacity-10 rounded-3xl border border-black border-opacity-0 backdrop-blur-sm flex flex-col items-center justify-center gap-4 text-4xl font-jacques">
				<Link
					className="w-80 h-24 bg-white rounded-3xl shadow hover:bg-secondary hover:text-white transition-all duration-300 ease-in-out flex flex-col text-center justify-center items-center "
					href="/student/signin/"
				>
					STUDENT
				</Link>
				<div className="flex">
					<div className="w-36 h-px border-2 mt-4 border-black"></div>
					<div className="text-black text-3xl font-normal font-jacques">OR</div>
					<div className="w-36 h-px border-2 mt-4 border-black"></div>
				</div>
				<Link
					className="w-80 h-24 bg-white rounded-3xl shadow hover:bg-secondary hover:text-white transition-all duration-300 ease-in-out flex flex-col text-center justify-center items-center text-4xl"
					href="/teacher/signin/"
				>
					TEACHER
				</Link>
			</div>
		</main>
	);
}

export default page;