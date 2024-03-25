import React, { useState, useEffect } from 'react';
import Link from 'next/link';

function Sidebar({ params }) {
  const [activePage, setActivePage] = useState('');

  useEffect(() => {
    try {
      // Check if running on the client side before using localStorage
      if (typeof window !== 'undefined') {
        const storedActivePage = localStorage.getItem('activePage');
        if (storedActivePage) {
          setActivePage(storedActivePage);
        }
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
  }, []);

  useEffect(() => {
    try {
      // Update local storage when activePage changes
      if (typeof window !== 'undefined') {
        localStorage.setItem('activePage', activePage);
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
  }, [activePage]);

  const handleItemClick = (page) => {
    setActivePage(page);
  };

  const menuItems = [
    { title: 'Dashboard', href: `/student/${params.studentid}` },
    { title: 'Video Summary', href: `/student/${params.studentid}/videoSummarize` },
    { title: 'Search Tuitions', href: `/student/${params.studentid}/search` },
    { title: 'Solve Doubts', href: 'https://scholizare-gemini-doubt-bot.onrender.com/' },
    { title: 'Wellness', href: 'https://scholizare-gemini-health-bot.onrender.com/' },
  ];

  const icons = {
    'Dashboard': (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path id="Vector" d="M0 10H8V0H0V10ZM0 18H8V12H0V18ZM10 18H18V8H10V18ZM10 0V6H18V0H10Z" fill="black" />
      </svg>
    ),
    'Video Summary': (
      <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 4.5V1C14 0.734784 13.8946 0.48043 13.7071 0.292893C13.5196 0.105357 13.2652 0 13 0H1C0.734784 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1V11C0 11.2652 0.105357 11.5196 0.292893 11.7071C0.48043 11.8946 0.734784 12 1 12H13C13.2652 12 13.5196 11.8946 13.7071 11.7071C13.8946 11.5196 14 11.2652 14 11V7.5L18 11.5V0.5L14 4.5Z" fill="black" />
      </svg>
    ),
    'Search Tuitions': (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 19L13 13M1 8C1 8.91925 1.18106 9.82951 1.53284 10.6788C1.88463 11.5281 2.40024 12.2997 3.05025 12.9497C3.70026 13.5998 4.47194 14.1154 5.32122 14.4672C6.1705 14.8189 7.08075 15 8 15C8.91925 15 9.82951 14.8189 10.6788 14.4672C11.5281 14.1154 12.2997 13.5998 12.9497 12.9497C13.5998 12.2997 14.1154 11.5281 14.4672 10.6788C14.8189 9.82951 15 8.91925 15 8C15 7.08075 14.8189 6.1705 14.4672 5.32122C14.1154 4.47194 13.5998 3.70026 12.9497 3.05025C12.2997 2.40024 11.5281 1.88463 10.6788 1.53284C9.82951 1.18106 8.91925 1 8 1C7.08075 1 6.1705 1.18106 5.32122 1.53284C4.47194 1.88463 3.70026 2.40024 3.05025 3.05025C2.40024 3.70026 1.88463 4.47194 1.53284 5.32122C1.18106 6.1705 1 7.08075 1 8Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    ),
    'Solve Doubts': (
      <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 0L0 6L4 8.18V14.18L11 18L18 14.18V8.18L20 7.09V14H22V6L11 0ZM17.82 6L11 9.72L4.18 6L11 2.28L17.82 6ZM16 13L11 15.72L6 13V9.27L11 12L16 9.27V13Z" fill="black" />
      </svg>
    ),
    'Wellness': (
      <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.00081 4.02965e-08C9.94337 0.000126694 11.8195 0.706882 13.2794 1.98843C14.7392 3.26999 15.6831 5.03882 15.9348 6.965L18.1848 10.504C18.3328 10.737 18.3028 11.084 17.9598 11.232L16.0008 12.07V15C16.0008 15.5304 15.7901 16.0391 15.415 16.4142C15.0399 16.7893 14.5312 17 14.0008 17H12.0018L12.0008 20H3.00081V16.306C3.00081 15.126 2.56481 14.009 1.75581 13.001C0.81351 11.8245 0.222786 10.4056 0.0517001 8.908C-0.119386 7.41036 0.136127 5.89486 0.788798 4.53611C1.44147 3.17737 2.46474 2.03066 3.74071 1.22811C5.01668 0.425571 6.49343 -0.000151226 8.00081 4.02965e-08ZM7.47081 5.763C7.14082 5.44416 6.6988 5.26768 6.23995 5.27157C5.78111 5.27546 5.34215 5.45942 5.01762 5.78382C4.69309 6.10822 4.50896 6.5471 4.50488 7.00595C4.5008 7.46479 4.6771 7.90688 4.99581 8.237L8.00081 11.243L11.0058 8.237C11.1729 8.07553 11.3062 7.8824 11.3979 7.66888C11.4895 7.45535 11.5378 7.22571 11.5397 6.99334C11.5417 6.76098 11.4974 6.53055 11.4094 6.3155C11.3213 6.10045 11.1913 5.90509 11.027 5.74081C10.8626 5.57653 10.6672 5.44662 10.4521 5.35868C10.2371 5.27073 10.0066 5.2265 9.77425 5.22856C9.54188 5.23063 9.31226 5.27895 9.09877 5.37071C8.88528 5.46247 8.6922 5.59582 8.53081 5.763L8.00081 6.293L7.47081 5.763Z" fill="black" />
      </svg>
    ),
  };

  return (
    <div className="flex flex-col items-center justify-normal gap-40 bg-secondary w-72 h-full pt-6 rounded-3xl">
      <div className="bg-[#141646] items-center flex justify-center rounded-full m-3 text-7xl text-primary/50 "><img className='w-32' src='/ScholizareLogo.png'/></div>
      <div className="flex flex-col justify-between h-72">
        {menuItems.map((menuItem, index) => (
          <Link
            key={index}
            className={`flex font-medium rounded-md px-1 py-2 border-2 border-secondary w-52 ease-out duration-500 transition-all h-content cursor-pointer justify-between text-black text-2xl font-jacques ${
              activePage === menuItem.title ? 'bg-primary' : 'hover:bg-primary focus:bg-primary'
            }`}
            onClick={() => handleItemClick(menuItem.title)}
            href={menuItem.href}
          >
            <p>{menuItem.title}</p>
            <div className="p-2">
              {icons[menuItem.title]}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
