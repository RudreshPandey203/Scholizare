import React from 'react';

const page = () => {
	return (
		<div className="bg-secondary flex flex-col justify-between items-center w-full h-screen pt-5 ">
			<div>
				<div className="font-jacques text-7xl text-center pb-20">Our Aim</div>
				<div className="text-center">
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe at
					ducimus est harum cupiditate illo inventore voluptate corporis
					asperiores eligendi dolore vero voluptatem ea, molestiae expedita
					velit beatae culpa corrupti, ut quam id exercitationem reiciendis amet
					officiis. Eos inventore placeat ullam excepturi similique quidem
					consectetur dolores debitis in necessitatibus quis perferendis quam
					obcaecati ut rem consequuntur est, ipsum quas itaque quibusdam
					accusantium quisquam ex modi? Voluptatum aspernatur quam praesentium
					nam a, quo illo ad quia, eaque hic eveniet reprehenderit consectetur
					perferendis. Molestiae quam error iure fugiat ipsum magnam adipisci
					doloribus iste eligendi, aliquid eaque quae ea voluptatem expedita
					tempora quibusdam.
				</div>
			</div>
			<div className="w-full flex justify-between items-center h-48 bg-primary/40 text-stone-700 px-10">
				<div className="w-full  flex flex-col justify-center ">
					For any queries reach out to us at:
					<div>
						Phone:<span className="underline"> 918989842</span>
					</div>
					<div>
						Mail:<span className="underline">abc@gmail.com</span>{' '}
					</div>
				</div>
                <div className='w-96'>
                <div>Made with ❤️ by Team Pixels</div>
                <div>Rudresh | Kadambini | Pranay</div>
                </div>
			</div>
		</div>
	);
};

export default page;
