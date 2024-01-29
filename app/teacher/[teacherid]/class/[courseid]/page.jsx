'use client'
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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

    <div className="overflow-y-hidden justify-center flex flex-col items-center">
      <h1 className="text-center stroke-indigo-500 font-bold text-4xl">
        {courseData && courseData.name}
      </h1>

      <div className="flex flex-row justify-evenly">
        <button
          className="p-5 m-3 bg-red-200"
          onClick={() => handleSectionChange("home")}
        >
          Participants
        </button>
        <button
          className="p-5 m-3 bg-red-200"
          onClick={() => handleSectionChange("file")}
        >
          File
        </button>
        <button
          className="p-5 m-3 bg-red-200"
          onClick={() => handleSectionChange("message")}
        >
          Message
        </button>
      </div>

      {currentPage === "home" && courseData && (
        <div>
          <h2>Participants</h2>
          <div className="px-2 py-3 bg-gray-400 m-3">
            <p className="text-3xl">{courseData.institutionName}</p>
          </div>
          {enrolledStudent &&
            enrolledStudent.map((student, index) => (
              <div className="px-2 py-3 bg-gray-400 m-3" key={index}>
                <p className="text-3xl">{student}</p>
              </div>
            ))}
        </div>
      )}

      {currentPage === "file" && (
        <div>
          <h2>File Section</h2>
          {/* Add your file section content here */}
        </div>
      )}

      {currentPage === "message" && (
        <div className=" bg-red-100 h-[83vh] w-[80vw]">
          <h2>Message Section</h2>
          <div>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Enter your message"
            />
            {newMessage.length > 0 &&
              newMessage.match(/\.(jpeg|jpg|gif|png)$/) && (
                <img
                  className="w-40 h-40 border-spacing-3 rounded-full"
                  src={newMessage}
                  alt="profile pic"
                />
              )}
            <input
              accept="image/*"
              type="file"
              name="image"
              onChange={picChange}
              autoComplete="image"
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
          <div
            className="overflow-y-scroll scroll-m-4 h-[70vh]"
            ref={scrollRef}
          >
            {messages.length > 0 &&
              messages.map((message, index) => (
                <div className="px-2 py-3 bg-gray-400 m-3" key={index}>
                  {message.message.includes("data:image") &&
                  message.message.length > 2000 ? (
                    <img
                      className="rounded-md w-32 h-auto"
                      src={message.message}
                    />
                  ) : (
                    <p className="text-3xl">{message.message}</p>
                  )}
                  <p className="text-xs">Sender: {message.sender}</p>
                  <p className="text-xs">Time: {message.timestamp}</p>
                </div>
              ))}
          </div>
        </div>
      )}
      
      <button
  onClick={() => window.open("https://meet.google.com/", "_blank")}
  className="p-5 m-3 bg-red-200"
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
  );
};

export default Page;