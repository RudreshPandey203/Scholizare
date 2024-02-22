import React from 'react'

function loading() {
  return (
    <div className="bg-white h-screen w-full flex p-4">
			{/*Sidebar*/}
			<div className="flex flex-col items-center justify-normal animate-pulse bg-gray-200 w-80 h-full pt-6 rounded-3xl">
				
				<div className="flex flex-col justify-between h-72">
					<div className="flex animate-pulse w-52 ease-out duration-500 transition-all h-12 cursor-pointer justify-between text-black text-2xl font-medium font-jacques bg-gray-300  rounded-md p-2 ">
					</div>
				</div>
				<div className="flex flex-col animate-pulse justify-between h-72">
					<div className="flex w-52 ease-out duration-500 transition-all h-12 cursor-pointer justify-between text-black text-2xl font-medium font-jacques bg-gray-300  rounded-md p-2 ">
					</div>
				</div>
				<div className="flex flex-col animate-pulse justify-between h-72">
					<div className="flex w-52 ease-out duration-500 transition-all h-12 cursor-pointer justify-between text-black text-2xl font-medium font-jacques bg-gray-300  rounded-md p-2 ">
					</div>
				</div>
				<div className="flex flex-col animate-pulse justify-between h-72">
					<div className="flex w-52 ease-out duration-500 transition-all h-12 cursor-pointer justify-between text-black text-2xl font-medium font-jacques bg-gray-300  rounded-md p-2 ">
					</div>
				</div>
				<div className="flex flex-col animate-pulse justify-between h-72">
					<div className="flex w-52 ease-out duration-500 transition-all h-12 cursor-pointer justify-between text-black text-2xl font-medium font-jacques bg-gray-300  rounded-md p-2 ">
					</div>
				</div>
				<div className="flex flex-col animate-pulse justify-between h-72">
					<div className="flex w-52 ease-out duration-500 transition-all h-12 cursor-pointer justify-between text-black text-2xl font-medium font-jacques bg-gray-300  rounded-md p-2 ">
					</div>
				</div>
			</div>
			{/*Main Page*/}
			<div className="pl-4 w-full flex-col animate-pulse h-fit">
				{/*Motto*/}
				<div className="w-content h-content bg-gray-200 rounded-[3rem] mt-2 p-14  flex flex-col gap-12 ">
					<div className="flex justify-between pr-14 pl-4 h-fit w-full flex-wrap ">
						<div className="flex flex-col items-start justify-center animate-pulse ">
							<div className="w-content animate-pulse bg-gray-300 text-gray-300 rounded-2xl text-5xl font-bold font-['Merriweather'] mb-2">
								Welcome Back, Shraddha!<br></br>
							</div>
							<div className="animate-pulse w-content bg-gray-300 text-gray-300 rounded-2xl text-5xl font-bold font-['Merriweather']">
								Welcome Back,<br></br>
							</div>
							<div className="animate-pulse w-96 h-36 text-gray-300  text-lg font-normal font-jacques ">
								<div className="flex justify-strech items-start gap-7 pt-6">
									<button className="w-36 h-12  text-white bg-gray-300  rounded-2xl flex justify-center items-center gap-4">
										
										
									</button>
									<button  className="animate-pulse w-36 h-12  bg-gray-300  text-white rounded-2xl flex justify-center items-center gap-4">
									</button>
								</div>
							</div>
						</div>
						<div>
							<div className="animate-pulse w-96 h-96 bg-gray-300 rounded-2xl flex justify-center items-center"></div>
						</div>
					</div>
				</div>
				{/*enrolled carousel */}
				<div className="flex flex-col gap-2 items-start p-4">
					<div className=" py-2 pl-6 font-['Merriweather'] rounded-2xl font-[450] text-3xl bg-gray-200 text-gray-200 ">Registered Courses:</div>
					<div className='w-[80vw]'>
						<div>
								<div>
									<div className= "flex  justify-center gap-1 items-center hover:scale-105 transition duration-300 ease-in-out font-jacques rounded-2xl bg-gray-200 w-content h-content">
										<p className="text-black  rounded-2xl text-lg font-normal font-jacques w-40 h-44 bg-gray-300">
											
										</p>
										<p className="text-black  rounded-2xl text-lg font-normal font-jacques w-40 h-44 bg-gray-300">
											
										</p>
										<p className="text-black  rounded-2xl text-lg font-normal font-jacques w-40 h-44 bg-gray-300">
											
										</p>
										<p className="text-black  rounded-2xl text-lg font-normal font-jacques w-40 h-44 bg-gray-300">
											
										</p>
										<p className="text-black rounded-2xl text-lg font-normal font-jacques w-40 h-44 bg-gray-300">
											
										</p>
										<p className="text-black rounded-2xl text-lg font-normal font-jacques w-40 h-44 bg-gray-300">
											
										</p>
									</div>
								</div>
							
						</div>
					</div>
				</div>
			</div>
		</div>
  )
}

export default loading