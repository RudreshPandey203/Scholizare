'use client'
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { MdOutlineGroup } from "react-icons/md";
import { FaFileAlt } from "react-icons/fa";
import { BiMessageRoundedDetail } from "react-icons/bi";
import { IoSend } from "react-icons/io5";
import { db, auth } from "../../../../firebase/config";
import { doc, getDoc, setDoc, collection, addDoc, getDocs, query, orderBy , updateDoc} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { update } from "firebase/database";

const Page = ({ params }) => {
  const [courseData, setCourseData] = useState(null);
  const [currentPage, setCurrentPage] = useState("home");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [enrolledStudent, setEnrolledStudent] = useState([]);
  const [user] = useAuthState(auth);

  const scrollRef = useRef();

  // Get the router object
  const router = useRouter();
  // const [showNotification, setShowNotification] = useState(false);
  // const [pendingRequests, setPendingRequests] = useState([]);

  // const courseId = params.courseid;

  // handleAccept = (studentId) => async () => {
  //   const docRef = doc(db, "students", studentId);
  //   const docSnap = await getDoc(docRef);
  //   if (docSnap.exists()) {
  //     const studentData = docSnap.data();
  //     const studentCourses = studentData.courses;
  //     studentCourses.push(courseId);
  //     await updateDoc(docRef, {
  //       courses: studentCourses,
  //     });
  //   } else {
  //     console.log("No such document!");
  //   }
  //   const courseDocRef = doc(db, "courses", courseId);
    
  // }
  // Fetch course data and enrolled students on component mount

    // Fetch course data and enrolled students on component mount
    useEffect(() => {
      const fetchCourseData = async () => {
        const courseRef = doc(db, "courses", params.courseid);
        const courseSnap = await getDoc(courseRef);
  
        if (courseSnap.exists()) {
          setCourseData(courseSnap.data());
          const enrollstudentname = [];
          if(courseSnap.data().students){
              for(var i = 0;i<courseSnap.data().students.length;i++){
                  const studentRef = doc(db, "students", courseSnap.data().students[i]);
                  const studentSnap = await getDoc(studentRef);
                  if(courseSnap.data().students[i] == user.uid){
                      setStudentData(studentSnap.data());
                  }
                  if(studentSnap.exists()){
                      enrollstudentname.push(studentSnap.data().name);
                  }
              }
          }
          setEnrolledStudent(enrollstudentname);
          setMessages(courseSnap.data().messages);
        }
      };
  
      fetchCourseData();
    }, [params.courseid, newMessage, user]);

  useEffect(() => {
    const fetchCourseData = async () => {
      const courseRef = doc(db, "courses", params.courseid);
      const courseSnap = await getDoc(courseRef);

      if (courseSnap.exists()) {
        setCourseData(courseSnap.data());
        // setEnrolledStudent(courseSnap.data().students);
        setMessages(courseSnap.data().messages);
      }
    };

    fetchCourseData();
  }, [params.courseid, newMessage]);

  const picChange = (e) => {
    console.log(e);
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = function () {
      console.log("profile pic base 64: ", reader.result);
      setNewMessage(reader.result);
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  };

    // Update the current page when the button is clicked
    const handleSectionChange = (section) => {
      setCurrentPage(section);
      // Save the current page to local storage
      localStorage.setItem("currentPage", section);
    };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      return; // Do not send empty messages
    }
  
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
  
    try {
      // Get the current messages document
      const messageRef = doc(db, 'courses', params.courseid);
      const messageData = await getDoc(messageRef);
      
      if (messageData.exists()) {
        // If the document exists, update the messages field
        const messages = messageData.data().messages || [];
        messages.push({ message: newMessage.trim(), sender: "teacher", timestamp: formattedDate });
  
        // Update the document with the new messages array
        await updateDoc(messageRef, { messages });
  
        // Reset the new message input
        setNewMessage('');
      } else {
        console.error('Messages document not found.');
      }
    } catch (error) {
      console.error('Error adding message:', error);
    }
  };
  


  // Scroll to the bottom of the chat window on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, currentPage]);


  return (
    <div className="py-4 px-6">
    <div className="flex flex-col gap-6">
      <h1 className="font-merriweather stroke-indigo-500 font-bold text-4xl">
        View {courseData && courseData.courseName} class details:
      </h1>
      <div className="bg-secondary p-4  rounded-lg h-fit">
      <div className="flex flex-row justify-evenly ">
        <button
          className="w-32 h-14 flex items-center justify-center gap-1 px-1 shadow-md bg-primary text-white font-md hover:bg-blue-600 transition  text-xl rounded-lg"
          onClick={() => handleSectionChange("home")}
        >
          Participants
          <MdOutlineGroup className="mt-1 w-10 h-10" />
        </button>
        <button
          className="w-32 h-14 shadow-md bg-primary flex items-center justify-center gap-1 px-1  text-white font-md hover:bg-blue-600 transition  text-xl rounded-lg"
          onClick={() => handleSectionChange("file")}
        >
          File
          <FaFileAlt className="mt-1 w-4 h-4" />
        </button>
        <button
          className="w-32 h-14 shadow-md flex items-center justify-center gap-1 px-1  bg-primary text-white font-md hover:bg-blue-600 transition  text-xl rounded-lg"
          onClick={() => handleSectionChange("message")}
        >
          Message
          <BiMessageRoundedDetail className="mt-1 w-4 h-4" />
        </button>
      </div>

      {currentPage === "home" && courseData && (
  <div className=" m-auto w-full  px-10 py-4 rounded-lg mt-4 bg-white">
    <h2 className="font-merriweather  text-4xl border-b mb-10">Participants:</h2>
    <div className=" m-3">
      <div className="text-3xl w-fit font-medium font-merriweather">
        <div>{courseData.teacherName}</div> 
        <div className="font-thin text-base ">~teacher</div>
      </div>
    </div>
    {enrolledStudent && (
      <nav>
      <ol className="list-decimal pl-4  text-xl ">
        {enrolledStudent.map((student, index) => (
          <li className="py-3  m-3 " key={index}>
            <p className="text-2xl">{student}</p>
          </li>
        ))}
      </ol>
    </nav>
    )}
  </div>
)}

      {currentPage === "file" && (
        <div>
          <h2>File Section</h2>
          {/* Add your file section content here */}
        </div>
      )}

{currentPage === "message" && (
  <div className="bg-white  w-full mt-10 p-6 rounded-lg">
    <h2 className="text-2xl font-bold mb-4">Message Section</h2>
    
    <div className="overflow-y-scroll h-[60vh]">
      {messages.length > 0 &&
        messages.map((message, index) => (
          <div className="bg-secondary w-fit  p-4 m-3 rounded-r-2xl rounded-b-2xl" key={index}>
            {message.message.includes("data:image") &&
            message.message.length > 2000 ? (
              <img
                className="rounded-md w-32 h-auto"
                src={message.message}
                alt="message"
              />
            ) : (
              <p className="text-lg">{message.message}</p>
            )}
            <p className="text-xs">Sender: {message.sender}</p>
            <p className="text-xs">Time: {message.timestamp}</p>
          </div>
        ))}
    </div>
    <div className="flex items-center mb-4">
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Enter your message"
        className="p-2 border border-gray-300 rounded mr-2 flex-grow"
      />
      <label className="file-input-label">
  <FaFileAlt className=" w-8 h-8 cursor-pointer" />
  <input
        accept="image/*"
        type="file"
        name="image"
        onChange={picChange}
        autoComplete="image"
        className="hidden"
      />
</label>
      
      <button
        onClick={handleSendMessage}
      >
        <IoSend className="w-8 h-8"/>
      </button>
    </div>
  </div>
)}

      </div>
      
      <button
  onClick={() => window.open("https://meet.google.com/", "_blank")}
  className="w-42 text-white rounded-lg p-5 m-auto bg-primary"
>
  Generate Google Meet link
</button>

      {/* <button
        target="iframe_a"
        onClick={() => window.open("https://meet.google.com/")}
        className="p-5 m-3 bg-red-200"
      >
        Generate google meet link
      </button> */}
    </div>
    </div>
  );
};

export default Page;