import Link from "next/link";
export default function Home() {
  return (
    <main
      className="flex flex-col text-center justify-center items-start w-full h-screen bg-cover px-16"
      style={{ backgroundImage: "url('/mainBG.png')" }}
    >
      <div className="w-[30rem] h-[28rem] bg-white bg-opacity-10 rounded-3xl border-black border-opacity-0 backdrop-blur-md flex flex-col justify-between px-10 py-8">
        <div>
          <div
            className="w-[26rem] h-32"
            style={{ backgroundImage: "url('/icon.png   ')" }}
          ></div>
          <div className="w-96 text-black text-2xl font-normal font-['Jacques Francois']">
            Your next door learning platform
          </div>
        </div>
        <div>
          <Link
            href="/option"
            className="w-96 h-20 bg-white rounded-3xl shadow border border-black text-black text-3xl font-normal font-jacques flex justify-center items-center"
          >
            GET STARTED
            <span>
              <svg
                width="60"
                height="49"
                viewBox="0 0 60 49"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.5 12.25L37.5 24.5L22.5 36.75"
                  stroke="black"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}
